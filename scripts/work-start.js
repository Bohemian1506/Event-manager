#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const GitUtils = require('./git-utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function confirmAction(message) {
  const answer = await askQuestion(`${message} (y/N): `);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * 作業開始のための完全自動化ワークフロー
 */
class WorkStartFlow {
  constructor() {
    this.initialBranch = null;
    this.newBranch = null;
  }

  /**
   * メイン実行フロー
   */
  async execute() {
    try {
      console.log('🚀 EventPay Manager - 作業開始ワークフロー');
      console.log('=====================================');
      console.log('');

      // Step 1: 安全性チェック
      await this.performSafetyCheck();

      // Step 2: mainブランチ最新化
      await this.updateMainBranch();

      // Step 3: 新しいブランチ作成
      await this.createNewBranch();

      // Step 4: 初期設定
      await this.performInitialSetup();

      // Step 5: 次のステップ案内
      this.showNextSteps();

      console.log('');
      console.log('✅ 作業開始ワークフローが完了しました！');
      console.log('🎯 コーディングを開始してください。');

    } catch (error) {
      console.error('❌ ワークフロー実行中にエラーが発生しました:', error.message);
      await this.handleError(error);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  /**
   * Step 1: 安全性チェック
   */
  async performSafetyCheck() {
    console.log('🔍 Step 1: 安全性チェック');
    console.log('--------------------------');

    this.initialBranch = GitUtils.getCurrentBranch();
    const safetyCheck = GitUtils.performSafetyCheck();
    
    const isSafe = GitUtils.displaySafetyCheckResults(safetyCheck);
    
    if (!isSafe) {
      console.log('');
      const proceed = await confirmAction('⚠️  問題が検出されましたが、続行しますか？');
      if (!proceed) {
        throw new Error('ユーザーによりワークフローが中断されました');
      }
    }

    console.log('');
  }

  /**
   * Step 2: mainブランチ最新化
   */
  async updateMainBranch() {
    console.log('📥 Step 2: mainブランチ最新化');
    console.log('-----------------------------');

    try {
      const result = await GitUtils.updateMainBranch();
      console.log('');
    } catch (error) {
      console.error('❌ mainブランチの更新に失敗しました');
      throw error;
    }
  }

  /**
   * Step 3: 新しいブランチ作成
   */
  async createNewBranch() {
    console.log('🌟 Step 3: 新しいブランチ作成');
    console.log('----------------------------');

    // ブランチタイプを選択
    console.log('ブランチタイプを選択してください:');
    console.log('1. feature (新機能開発)');
    console.log('2. fix (バグ修正)');
    console.log('3. refactor (リファクタリング)');
    console.log('4. docs (ドキュメント更新)');
    console.log('5. test (テスト追加・修正)');
    console.log('6. chore (その他のメンテナンス)');
    console.log('');

    const typeChoice = await askQuestion('選択 (1-6): ');
    const types = ['feature', 'fix', 'refactor', 'docs', 'test', 'chore'];
    const branchType = types[parseInt(typeChoice) - 1] || 'feature';

    // タスク名を入力
    console.log('');
    const taskName = await askQuestion('タスク名を入力してください (kebab-case): ');
    
    if (!taskName || taskName.trim() === '') {
      throw new Error('タスク名が入力されていません');
    }

    // ブランチ名の妥当性チェック
    const sanitizedTaskName = taskName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    this.newBranch = `${branchType}/${sanitizedTaskName}`;

    // ブランチ名の重複チェック
    if (GitUtils.branchExists(this.newBranch)) {
      throw new Error(`ブランチ '${this.newBranch}' は既に存在します`);
    }

    console.log('');
    console.log(`🎯 作成するブランチ: ${this.newBranch}`);
    
    const proceed = await confirmAction('このブランチを作成しますか？');
    if (!proceed) {
      throw new Error('ブランチ作成が中断されました');
    }

    // ブランチ作成
    try {
      console.log('');
      console.log('🔀 ブランチを作成中...');
      execSync(`git checkout -b ${this.newBranch}`, { stdio: 'inherit' });
      console.log(`✅ ブランチ '${this.newBranch}' を作成しました`);
    } catch (error) {
      throw new Error(`ブランチ作成に失敗しました: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Step 4: 初期設定
   */
  async performInitialSetup() {
    console.log('⚙️  Step 4: 初期設定');
    console.log('-------------------');

    try {
      // 初期空コミット
      console.log('📝 初期コミットを作成中...');
      execSync(`git commit --allow-empty -m "chore: initialize ${this.newBranch} branch"`, { stdio: 'inherit' });
      
      // リモートにプッシュ
      console.log('📤 リモートにプッシュ中...');
      execSync(`git push -u origin ${this.newBranch}`, { stdio: 'inherit' });
      
      console.log('✅ 初期設定が完了しました');
      
    } catch (error) {
      console.log('⚠️  初期設定中にエラーが発生しましたが、ローカルブランチは作成されています');
      console.log('   手動でプッシュを実行してください: git push -u origin ' + this.newBranch);
    }

    console.log('');
  }

  /**
   * Step 5: 次のステップ案内
   */
  showNextSteps() {
    console.log('📋 次のステップ');
    console.log('---------------');
    console.log('1. 📝 コードの実装・編集を行う');
    console.log('2. 📊 変更をステージング: git add .');
    console.log('3. 💾 コミット: git commit -m "feat: 実装内容"');
    console.log('4. 📤 プッシュ: git push');
    console.log('5. 🔄 プルリクエストが自動作成されます');
    console.log('');
    console.log('💡 推奨コマンド:');
    console.log('   • npm run dev:commit  (対話式コミット)');
    console.log('   • npm run quality:check  (品質チェック)');
    console.log('   • npm run security:scan  (セキュリティスキャン)');
  }

  /**
   * エラーハンドリング
   */
  async handleError(error) {
    console.log('');
    console.log('🔧 エラー復旧オプション:');
    
    if (this.newBranch && GitUtils.branchExists(this.newBranch)) {
      console.log(`1. 作成されたブランチ '${this.newBranch}' を削除: git branch -D ${this.newBranch}`);
    }
    
    if (this.initialBranch && this.initialBranch !== GitUtils.getCurrentBranch()) {
      console.log(`2. 元のブランチに戻る: git checkout ${this.initialBranch}`);
      
      const restore = await confirmAction('元のブランチに戻りますか？');
      if (restore) {
        try {
          execSync(`git checkout ${this.initialBranch}`, { stdio: 'inherit' });
          console.log(`✅ ${this.initialBranch} に戻りました`);
        } catch (checkoutError) {
          console.log('❌ ブランチの切り替えに失敗しました');
        }
      }
    }
    
    console.log('');
    console.log('❓ 問題が解決しない場合:');
    console.log('   • npm run hooks:install  (Git フック再インストール)');
    console.log('   • docs/workflows/troubleshooting.md を参照');
  }
}

// メイン実行
async function main() {
  const workflow = new WorkStartFlow();
  await workflow.execute();
}

// コマンドラインから直接実行された場合
if (require.main === module) {
  main().catch(error => {
    console.error('予期しないエラーが発生しました:', error.message);
    process.exit(1);
  });
}

module.exports = WorkStartFlow;