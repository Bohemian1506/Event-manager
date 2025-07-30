#!/usr/bin/env node

const { execSync } = require('child_process');

function autoPush() {
  try {
    console.log('🚀 EventPay Manager - 自動プッシュ');
    console.log('');

    // 現在のブランチを確認
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    
    if (currentBranch === 'main' || currentBranch === 'master') {
      console.log('❌ メインブランチへの直接プッシュはできません');
      process.exit(1);
    }

    console.log(`📤 ブランチ ${currentBranch} をプッシュ中...`);

    // コミットされていない変更があるかチェック
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('⚠️  コミットされていない変更があります:');
      execSync('git status --short', { stdio: 'inherit' });
      console.log('');
      console.log('💡 先にコミットしてからプッシュしてください');
      process.exit(1);
    }

    // プッシュ実行
    execSync(`git push -u origin ${currentBranch}`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ プッシュが完了しました！');
    console.log('🔗 GitHubのワークフローでプルリクエストが自動作成されます');
    
    // PRのURLを表示（可能であれば）
    try {
      const repoUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      const repoMatch = repoUrl.match(/github\.com[\/:](.+)\.git$/);
      if (repoMatch) {
        const repoPath = repoMatch[1];
        console.log(`📋 プルリクエスト: https://github.com/${repoPath}/pulls`);
      }
    } catch (error) {
      // URLの取得に失敗しても続行
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// メイン実行  
if (require.main === module) {
  autoPush();
}

module.exports = { autoPush };