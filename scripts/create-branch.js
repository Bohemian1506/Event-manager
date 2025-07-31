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

async function createBranch() {
  try {
    console.log('🔀 EventPay Manager - 自動ブランチ作成');
    console.log('');

    // 安全性チェック（簡易版）
    console.log('🔍 安全性チェック中...');
    const safetyCheck = GitUtils.performSafetyCheck();
    const isSafe = GitUtils.displaySafetyCheckResults(safetyCheck);
    
    if (!isSafe) {
      const proceed = await confirmAction('⚠️  問題が検出されましたが、続行しますか？');
      if (!proceed) {
        console.log('❌ ブランチ作成を中断しました');
        process.exit(1);
      }
    }
    console.log('');

    // 現在のブランチを確認
    const currentBranch = GitUtils.getCurrentBranch();
    console.log(`現在のブランチ: ${currentBranch}`);

    // メインブランチに移動して最新化（GitUtilsを使用）
    if (currentBranch !== 'main') {
      console.log('📥 メインブランチに移動して最新化中...');
      try {
        await GitUtils.updateMainBranch();
      } catch (error) {
        console.error('❌ mainブランチの更新に失敗しました:', error.message);
        const proceed = await confirmAction('mainブランチの更新に失敗しましたが、続行しますか？');
        if (!proceed) {
          throw error;
        }
      }
    } else {
      // 既にmainブランチにいる場合の最新化チェック
      const syncStatus = GitUtils.checkRemoteSync('main');
      if (syncStatus.needsPull) {
        console.log('📥 mainブランチを最新化中...');
        execSync('git pull origin main', { stdio: 'inherit' });
      }
    }

    // ブランチタイプを選択
    console.log('');
    console.log('ブランチタイプを選択してください:');
    console.log('1. feature (新機能)');
    console.log('2. fix (バグ修正)');
    console.log('3. refactor (リファクタリング)');
    console.log('4. docs (ドキュメント)');
    console.log('5. test (テスト)');
    console.log('6. chore (その他)');

    const typeChoice = await askQuestion('選択 (1-6): ');
    const types = ['feature', 'fix', 'refactor', 'docs', 'test', 'chore'];
    const branchType = types[parseInt(typeChoice) - 1] || 'feature';

    // ブランチ名を入力
    const taskName = await askQuestion('タスク名を入力してください (kebab-case): ');
    
    if (!taskName) {
      console.log('❌ タスク名が入力されていません');
      process.exit(1);
    }

    // ブランチ名を生成（安全な名前に変換）
    const sanitizedTaskName = taskName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const branchName = `${branchType}/${sanitizedTaskName}`;
    
    // ブランチ名の重複チェック
    if (GitUtils.branchExists(branchName)) {
      console.log(`❌ ブランチ '${branchName}' は既に存在します`);
      console.log('異なるタスク名を入力してください。');
      process.exit(1);
    }
    
    console.log('');
    console.log(`🌟 新しいブランチを作成します: ${branchName}`);
    
    const proceed = await confirmAction('このブランチを作成しますか？');
    if (!proceed) {
      console.log('❌ ブランチ作成を中断しました');
      process.exit(1);
    }
    
    // ブランチ作成と切り替え
    console.log('🔀 ブランチを作成中...');
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    
    // 初期空コミット
    console.log('📝 初期コミットを作成中...');
    execSync(`git commit --allow-empty -m "chore: initialize ${branchName} branch"`, { stdio: 'inherit' });
    
    // リモートにプッシュ
    try {
      console.log('📤 リモートにプッシュ中...');
      execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  リモートプッシュに失敗しましたが、ローカルブランチは作成されています');
      console.log('   手動でプッシュを実行してください: git push -u origin ' + branchName);
    }
    
    console.log('');
    console.log('✅ ブランチ作成が完了しました！');
    console.log(`🚀 現在のブランチ: ${branchName}`);
    console.log('');
    console.log('💡 次のステップ:');
    console.log('  - コードを編集・実装');
    console.log('  - npm run dev:commit  (対話式コミット)');
    console.log('  - git push でプルリクエストが自動作成されます');
    console.log('');
    console.log('🔧 利用可能なコマンド:');
    console.log('  - npm run quality:check  (品質チェック)');
    console.log('  - npm run security:scan  (セキュリティスキャン)');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// メイン実行
if (require.main === module) {
  createBranch();
}

module.exports = { createBranch };