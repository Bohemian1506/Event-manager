#!/usr/bin/env node

const { execSync } = require('child_process');

/**
 * Git関連のユーティリティ関数を提供するモジュール
 */
class GitUtils {
  /**
   * 現在のブランチ名を取得
   */
  static getCurrentBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      throw new Error('Gitリポジトリではないか、ブランチが存在しません');
    }
  }

  /**
   * 作業ディレクトリの状態をチェック
   */
  static checkWorkingDirectory() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      return {
        isClean: status.trim() === '',
        hasUnstagedChanges: status.includes(' M') || status.includes('??'),
        hasStagedChanges: status.includes('M ') || status.includes('A '),
        statusOutput: status
      };
    } catch (error) {
      throw new Error('Git状態の確認に失敗しました');
    }
  }

  /**
   * リモートブランチとの同期状態をチェック
   */
  static checkRemoteSync(branchName = null) {
    const branch = branchName || this.getCurrentBranch();
    try {
      // リモートから最新情報を取得
      execSync('git fetch origin', { stdio: 'pipe' });
      
      // ローカルとリモートのコミット差分を確認
      const aheadBehind = execSync(`git rev-list --left-right --count origin/${branch}...HEAD`, { encoding: 'utf8' }).trim();
      const [behind, ahead] = aheadBehind.split('\t').map(n => parseInt(n));
      
      return {
        isUpToDate: ahead === 0 && behind === 0,
        aheadCount: ahead,
        behindCount: behind,
        needsPull: behind > 0,
        needsPush: ahead > 0
      };
    } catch (error) {
      // リモートブランチが存在しない場合
      return {
        isUpToDate: true,
        aheadCount: 0,
        behindCount: 0,
        needsPull: false,
        needsPush: false,
        remoteNotExists: true
      };
    }
  }

  /**
   * ネットワーク接続とリモートリポジトリへのアクセスをチェック
   */
  static checkRemoteConnection() {
    try {
      execSync('git ls-remote origin HEAD', { stdio: 'pipe' });
      return { connected: true };
    } catch (error) {
      return { 
        connected: false, 
        error: 'リモートリポジトリに接続できません。ネットワーク接続を確認してください。' 
      };
    }
  }

  /**
   * ブランチが存在するかチェック
   */
  static branchExists(branchName, checkRemote = false) {
    try {
      if (checkRemote) {
        execSync(`git rev-parse --verify origin/${branchName}`, { stdio: 'pipe' });
      } else {
        execSync(`git rev-parse --verify ${branchName}`, { stdio: 'pipe' });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * mainブランチを安全に最新化
   */
  static async updateMainBranch() {
    const currentBranch = this.getCurrentBranch();
    
    console.log('📥 mainブランチの最新化を開始...');
    
    // リモート接続確認
    const remoteCheck = this.checkRemoteConnection();
    if (!remoteCheck.connected) {
      throw new Error(remoteCheck.error);
    }

    try {
      // 現在のブランチがmainでない場合、mainに切り替え
      if (currentBranch !== 'main') {
        console.log(`   現在のブランチ: ${currentBranch} → main に切り替え`);
        execSync('git checkout main', { stdio: 'inherit' });
      }

      // リモートから最新を取得
      console.log('   リモートから最新情報を取得中...');
      execSync('git pull origin main', { stdio: 'inherit' });
      
      // 同期状態を確認
      const syncStatus = this.checkRemoteSync('main');
      if (syncStatus.isUpToDate || syncStatus.remoteNotExists) {
        console.log('✅ mainブランチが最新に更新されました');
        return { success: true, previousBranch: currentBranch };
      } else {
        throw new Error('mainブランチの同期に問題があります');
      }
      
    } catch (error) {
      // エラー時は元のブランチに戻す
      if (currentBranch !== 'main') {
        try {
          execSync(`git checkout ${currentBranch}`, { stdio: 'pipe' });
        } catch (checkoutError) {
          console.log('⚠️  元のブランチに戻せませんでした');
        }
      }
      throw error;
    }
  }

  /**
   * 作業開始前の安全性チェック
   */
  static performSafetyCheck() {
    console.log('🔍 作業開始前の安全性チェックを実行中...');
    
    const issues = [];
    const warnings = [];

    try {
      // 1. 作業ディレクトリの状態確認
      const workDir = this.checkWorkingDirectory();
      if (!workDir.isClean) {
        if (workDir.hasUnstagedChanges) {
          issues.push('未コミットの変更があります。先にコミットまたはstashしてください。');
        }
        if (workDir.hasStagedChanges) {
          warnings.push('ステージされた変更があります。');
        }
      }

      // 2. リモート接続確認
      const remoteCheck = this.checkRemoteConnection();
      if (!remoteCheck.connected) {
        issues.push(remoteCheck.error);
      }

      // 3. 現在のブランチとmainブランチの同期状態確認
      const currentBranch = this.getCurrentBranch();
      if (currentBranch === 'main') {
        const syncStatus = this.checkRemoteSync('main');
        if (syncStatus.needsPull) {
          warnings.push(`mainブランチがリモートより${syncStatus.behindCount}コミット遅れています。`);
        }
      }

      return {
        safe: issues.length === 0,
        issues,
        warnings,
        workingDirectory: workDir,
        currentBranch
      };

    } catch (error) {
      return {
        safe: false,
        issues: [`安全性チェック中にエラーが発生しました: ${error.message}`],
        warnings: [],
        currentBranch: 'unknown'
      };
    }
  }

  /**
   * 安全性チェック結果を表示
   */
  static displaySafetyCheckResults(results) {
    if (results.safe && results.warnings.length === 0) {
      console.log('✅ 安全性チェック: すべて正常です');
      return true;
    }

    if (results.issues.length > 0) {
      console.log('❌ 解決が必要な問題が見つかりました:');
      results.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    if (results.warnings.length > 0) {
      console.log('⚠️  注意事項:');
      results.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    return results.safe;
  }
}

module.exports = GitUtils;

// コマンドラインから直接実行された場合
if (require.main === module) {
  const safetyCheck = GitUtils.performSafetyCheck();
  GitUtils.displaySafetyCheckResults(safetyCheck);
  process.exit(safetyCheck.safe ? 0 : 1);
}