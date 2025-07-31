#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

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

// 変更内容を分析してコミットタイプとメッセージを推測する関数
function analyzeChanges() {
  try {
    // ステージされた変更ファイルを取得
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim().split('\n').filter(f => f);
    
    if (stagedFiles.length === 0) {
      // ステージされていない場合は全変更を確認
      const allFiles = execSync('git diff --name-only', { encoding: 'utf8' }).trim().split('\n').filter(f => f);
      if (allFiles.length === 0) {
        return { type: 'chore', message: '軽微な変更', files: [] };
      }
      return analyzeFileChanges(allFiles);
    }
    
    return analyzeFileChanges(stagedFiles);
  } catch (error) {
    return { type: 'chore', message: '変更の分析に失敗', files: [] };
  }
}

function analyzeFileChanges(files) {
  const analysis = {
    hasNewFiles: false,
    hasTests: false,
    hasDocs: false,
    hasViews: false,
    hasControllers: false,
    hasModels: false,
    hasConfig: false,
    hasAssets: false,
    hasScripts: false,
    fileCount: files.length
  };
  
  files.forEach(file => {
    // 新規ファイルかチェック
    try {
      execSync(`git ls-files --error-unmatch "${file}" 2>/dev/null`, { stdio: 'ignore' });
    } catch {
      analysis.hasNewFiles = true;
    }
    
    // ファイルタイプ分析
    if (file.includes('_test.') || file.includes('_spec.') || file.includes('/test/') || file.includes('/spec/')) {
      analysis.hasTests = true;
    } else if (file.includes('.md') || file.includes('/docs/')) {
      analysis.hasDocs = true;
    } else if (file.includes('/views/') || file.includes('.erb')) {
      analysis.hasViews = true;
    } else if (file.includes('/controllers/') || file.includes('_controller.rb')) {
      analysis.hasControllers = true;
    } else if (file.includes('/models/') || file.includes('.rb') && !file.includes('_controller.rb') && !file.includes('/config/')) {
      analysis.hasModels = true;
    } else if (file.includes('/config/') || file.includes('.yml') || file.includes('.yaml') || file.includes('.json')) {
      analysis.hasConfig = true;
    } else if (file.includes('/assets/') || file.includes('.css') || file.includes('.scss') || file.includes('.js')) {
      analysis.hasAssets = true;
    } else if (file.includes('/scripts/') || file.includes('package.json')) {
      analysis.hasScripts = true;
    }
  });
  
  return generateCommitSuggestion(analysis, files);
}

function generateCommitSuggestion(analysis, files) {
  let type = 'feat';
  let message = '';
  
  if (analysis.hasDocs && !analysis.hasControllers && !analysis.hasModels && !analysis.hasViews) {
    type = 'docs';
    message = 'ドキュメントを更新';
  } else if (analysis.hasTests && !analysis.hasControllers && !analysis.hasModels) {
    type = 'test';
    message = 'テストを追加・更新';
  } else if (analysis.hasAssets && !analysis.hasControllers && !analysis.hasModels) {
    type = 'style';
    message = 'スタイル・アセットを更新';
  } else if (analysis.hasConfig) {
    type = 'chore';
    message = '設定ファイルを更新';
  } else if (analysis.hasScripts) {
    type = 'chore';
    message = 'スクリプトを更新';
  } else if (analysis.hasNewFiles) {
    type = 'feat';
    if (analysis.hasControllers) {
      message = '新しいコントローラーを追加';
    } else if (analysis.hasModels) {
      message = '新しいモデルを追加';
    } else if (analysis.hasViews) {
      message = '新しいビューを追加';
    } else {
      message = '新機能を追加';
    }
  } else {
    if (files.some(f => f.includes('fix') || f.includes('bug'))) {
      type = 'fix';
      message = 'バグを修正';
    } else if (analysis.hasControllers || analysis.hasModels || analysis.hasViews) {
      type = 'feat';
      message = '機能を改良';
    } else {
      type = 'refactor';
      message = 'コードをリファクタリング';
    }
  }
  
  return { type, message, files };
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

    // 変更内容を分析して推奨メッセージを生成
    console.log('🔍 変更内容を分析中...');
    const suggestion = analyzeChanges();
    
    console.log('\n📋 推奨コミット情報:');
    console.log(`タイプ: ${suggestion.type}`);
    console.log(`メッセージ: ${suggestion.message}`);
    if (suggestion.files.length > 0) {
      console.log(`変更ファイル数: ${suggestion.files.length}`);
    }
    console.log('');
    
    // 推奨を使用するか確認
    const useRecommended = await askQuestion('推奨設定を使用しますか？ (Y/n): ');
    
    let commitType = suggestion.type;
    let commitMessage = suggestion.message;
    
    if (useRecommended.toLowerCase() === 'n') {
      // 手動選択
      console.log('\nコミットタイプを選択してください:');
      console.log('1. feat (新機能)');
      console.log('2. fix (バグ修正)');
      console.log('3. refactor (リファクタリング)');
      console.log('4. docs (ドキュメント)');
      console.log('5. test (テスト)');
      console.log('6. style (スタイル)');
      console.log('7. chore (その他)');

      const typeChoice = await askQuestion('選択 (1-7): ');
      const types = ['feat', 'fix', 'refactor', 'docs', 'test', 'style', 'chore'];
      commitType = types[parseInt(typeChoice) - 1] || 'feat';

      // コミットメッセージを入力
      commitMessage = await askQuestion('コミットメッセージを入力してください: ');
    } else {
      // 推奨メッセージの編集を確認
      const editMessage = await askQuestion('メッセージを編集しますか？ (y/N): ');
      if (editMessage.toLowerCase() === 'y') {
        commitMessage = await askQuestion(`メッセージを編集 [${suggestion.message}]: `) || suggestion.message;
      }
    }
    
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