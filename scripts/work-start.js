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

async function workStart() {
  try {
    console.log('🚀 EventPay Manager - 作業開始自動化');
    console.log('');

    // Step 1: git:update の実行
    console.log('📥 Step 1: メインブランチを最新化中...');
    console.log('実行中: npm run git:update');
    execSync('npm run git:update', { stdio: 'inherit' });
    console.log('✅ メインブランチの最新化が完了しました');
    console.log('');

    // Step 2: dev:branch の実行
    console.log('🔀 Step 2: 新しいブランチを作成します');
    console.log('');

    // ブランチタイプを選択
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

    // タスク名を入力
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
    console.log('🎉 作業開始の準備が完了しました！');
    console.log(`🚀 現在のブランチ: ${branchName}`);
    console.log('');
    console.log('📝 次のステップ:');
    console.log('  1. コードを編集・実装');
    console.log('  2. npm run dev:commit でコミット');
    console.log('  3. プッシュ時にプルリクエストが自動作成されます');
    console.log('');
    console.log('🤖 AI協調開発のヒント:');
    console.log('  - 新機能実装時: zen-mcp-server /consensus で設計検討');
    console.log('  - コミット前: zen-mcp-server /precommit で品質チェック');
    console.log('  - PR作成後: @claude メンションでレビュー依頼');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// メイン実行
if (require.main === module) {
  workStart();
}

module.exports = { workStart };