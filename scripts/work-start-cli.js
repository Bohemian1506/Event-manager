#!/usr/bin/env node

const { execSync } = require('child_process');

function workStartCli(branchType, taskDescription) {
  try {
    console.log('🚀 EventPay Manager - 作業開始自動化 (CLI)');
    console.log('');

    // Step 1: git:update の実行
    console.log('📥 Step 1: メインブランチを最新化中...');
    console.log('実行中: npm run git:update');
    execSync('npm run git:update', { stdio: 'inherit' });
    console.log('✅ メインブランチの最新化が完了しました');
    console.log('');

    // Step 2: ブランチ作成
    console.log('🔀 Step 2: 新しいブランチを作成します');
    console.log('');

    // タスク説明からkebab-caseのブランチ名を生成
    const taskName = taskDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // 特殊文字を除去
      .replace(/\s+/g, '-') // スペースをハイフンに変換
      .replace(/-+/g, '-') // 連続するハイフンを1つに
      .replace(/^-|-$/g, ''); // 先頭・末尾のハイフンを除去
    
    // ブランチ名を生成
    const branchName = `${branchType}/${taskName}`;
    
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
  }
}

// メイン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('使用方法: node work-start-cli.js <type> "<task-description>"');
    console.log('');
    console.log('利用可能なタイプ:');
    console.log('  - feature (新機能)');
    console.log('  - fix (バグ修正)');
    console.log('  - refactor (リファクタリング)');
    console.log('  - docs (ドキュメント)');
    console.log('  - test (テスト)');
    console.log('  - chore (その他)');
    console.log('');
    console.log('例: node work-start-cli.js feature "Add user login functionality"');
    console.log('    → ブランチ名: feature/add-user-login-functionality');
    console.log('');
    console.log('例: node work-start-cli.js fix "Fix payment processing bug"');
    console.log('    → ブランチ名: fix/fix-payment-processing-bug');
    process.exit(1);
  }

  const [branchType, ...taskParts] = args;
  const taskDescription = taskParts.join(' ');
  const validTypes = ['feature', 'fix', 'refactor', 'docs', 'test', 'chore'];
  
  if (!validTypes.includes(branchType)) {
    console.error(`❌ 無効なブランチタイプ: ${branchType}`);
    console.error(`有効なタイプ: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  workStartCli(branchType, taskDescription);
}

module.exports = { workStartCli };