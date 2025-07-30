#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

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

async function createBranch() {
  try {
    console.log('🔀 EventPay Manager - 自動ブランチ作成');
    console.log('');

    // 現在のブランチを確認
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    console.log(`現在のブランチ: ${currentBranch}`);

    // メインブランチに移動して最新化
    if (currentBranch !== 'main') {
      console.log('📥 メインブランチに移動して最新化中...');
      execSync('git checkout main', { stdio: 'inherit' });
      execSync('git pull origin main', { stdio: 'inherit' });
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

    // ブランチ名を生成
    const branchName = `${branchType}/${taskName}`;
    
    console.log('');
    console.log(`🌟 新しいブランチを作成します: ${branchName}`);
    
    // ブランチ作成と切り替え
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    
    // 初期空コミット
    execSync(`git commit --allow-empty -m "chore: initialize ${branchName} branch"`, { stdio: 'inherit' });
    
    // リモートにプッシュ
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ ブランチ作成が完了しました！');
    console.log(`🚀 現在のブランチ: ${branchName}`);
    console.log('');
    console.log('💡 次のステップ:');
    console.log('  - コードを編集・実装');
    console.log('  - git add . && git commit -m "feat: 実装内容"');
    console.log('  - git push でプルリクエストが自動作成されます');

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