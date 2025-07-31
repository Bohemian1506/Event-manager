#!/usr/bin/env node

const { execSync } = require('child_process');

function createBranch(branchType, taskName) {
  try {
    console.log('🔀 EventPay Manager - ブランチ作成 (CLI)');
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
    console.log('  - npm run dev:commit でコミット');
    console.log('  - プッシュ時にプルリクエストが自動作成されます');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// メイン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('使用方法: node create-branch-cli.js <type> <task-name>');
    console.log('');
    console.log('利用可能なタイプ:');
    console.log('  - feature (新機能)');
    console.log('  - fix (バグ修正)');
    console.log('  - refactor (リファクタリング)');
    console.log('  - docs (ドキュメント)');
    console.log('  - test (テスト)');
    console.log('  - chore (その他)');
    console.log('');
    console.log('例: node create-branch-cli.js feature add-user-login');
    process.exit(1);
  }

  const [branchType, taskName] = args;
  const validTypes = ['feature', 'fix', 'refactor', 'docs', 'test', 'chore'];
  
  if (!validTypes.includes(branchType)) {
    console.error(`❌ 無効なブランチタイプ: ${branchType}`);
    console.error(`有効なタイプ: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  createBranch(branchType, taskName);
}

module.exports = { createBranch };