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

async function autoCommit() {
  try {
    console.log('📝 EventPay Manager - 自動コミット');
    console.log('');

    // Gitステータス確認
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!status.trim()) {
      console.log('ℹ️  コミットする変更がありません');
      return;
    }

    console.log('📋 変更されたファイル:');
    execSync('git status --short', { stdio: 'inherit' });
    console.log('');

    // コミットタイプを選択
    console.log('コミットタイプを選択してください:');
    console.log('1. feat (新機能)');
    console.log('2. fix (バグ修正)');
    console.log('3. refactor (リファクタリング)');
    console.log('4. docs (ドキュメント)');
    console.log('5. test (テスト)');
    console.log('6. style (スタイル)');
    console.log('7. chore (その他)');

    const typeChoice = await askQuestion('選択 (1-7): ');
    const types = ['feat', 'fix', 'refactor', 'docs', 'test', 'style', 'chore'];
    const commitType = types[parseInt(typeChoice) - 1] || 'feat';

    // コミットメッセージを入力
    const commitMessage = await askQuestion('コミットメッセージを入力してください: ');
    
    if (!commitMessage) {
      console.log('❌ コミットメッセージが入力されていません');
      process.exit(1);
    }

    // 自動プッシュするかどうか
    const autoPush = await askQuestion('自動プッシュしますか？ (y/N): ');
    
    // 完全なコミットメッセージを生成
    const fullMessage = `${commitType}: ${commitMessage}${autoPush.toLowerCase() === 'y' ? ' [auto-push]' : ''}`;
    
    console.log('');
    console.log(`📝 コミット実行: ${fullMessage}`);
    
    // ステージングとコミット
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ コミットが完了しました！');
    
    // 自動プッシュが選択された場合、プッシュは post-commit フックで実行される
    if (autoPush.toLowerCase() === 'y') {
      console.log('🚀 自動プッシュが有効になりました (post-commitフックで実行)');
    } else {
      console.log('');
      console.log('💡 次のステップ:');
      console.log('  - git push でリモートにプッシュ');
      console.log('  - プッシュ時にプルリクエストが自動作成されます');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// メイン実行
if (require.main === module) {
  autoCommit();
}

module.exports = { autoCommit };