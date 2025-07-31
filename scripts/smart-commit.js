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

function analyzeChanges() {
  console.log('🤖 Claude連携型スマートコミット');
  console.log('📊 変更内容を分析中...');
  console.log('');

  try {
    // Gitステータス確認
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!status.trim()) {
      console.log('ℹ️  コミットする変更がありません');
      return null;
    }

    // 変更されたファイルの情報を取得
    const changedFiles = status.trim().split('\n').map(line => {
      const statusCode = line.substring(0, 2);
      const filePath = line.substring(3);
      return { statusCode, filePath };
    });

    // 差分情報を取得
    let diffOutput = '';
    try {
      diffOutput = execSync('git diff --cached --name-status', { encoding: 'utf8' });
      if (!diffOutput.trim()) {
        // ステージされた変更がない場合、すべての変更を確認
        diffOutput = execSync('git diff --name-status', { encoding: 'utf8' });
      }
    } catch (error) {
      console.log('⚠️  差分情報の取得をスキップ');
    }

    console.log('📋 変更されたファイル:');
    execSync('git status --short', { stdio: 'inherit' });
    console.log('');

    return {
      changedFiles,
      diffOutput,
      hasChanges: true
    };
    
  } catch (error) {
    console.error('❌ Git情報の取得に失敗しました:', error.message);
    return null;
  }
}

function suggestCommitInfo(changes) {
  if (!changes || !changes.changedFiles) {
    return { type: 'chore', confidence: 0.5, message: '変更内容を更新', reason: 'デフォルト提案' };
  }

  const files = changes.changedFiles;
  const allFiles = files.map(f => f.filePath.toLowerCase()).join(' ');
  
  // ファイル名とパスから推測
  const suggestions = [];
  
  // 新機能の推測
  if (files.some(f => f.statusCode.includes('A')) || allFiles.includes('new') || allFiles.includes('add')) {
    suggestions.push({ 
      type: 'feat', 
      confidence: 0.8, 
      message: '新機能を追加',
      reason: '新しいファイルが追加されている'
    });
  }
  
  // バグ修正の推測
  if (allFiles.includes('fix') || allFiles.includes('bug') || 
      files.some(f => f.filePath.includes('spec') || f.filePath.includes('test'))) {
    suggestions.push({ 
      type: 'fix', 
      confidence: 0.7,
      message: 'バグを修正',
      reason: 'fix/bugファイルまたはテストファイルが変更されている'
    });
  }
  
  // リファクタリングの推測
  if (allFiles.includes('refactor') || allFiles.includes('improve') ||
      (files.length > 3 && !files.some(f => f.statusCode.includes('A')))) {
    suggestions.push({ 
      type: 'refactor', 
      confidence: 0.7,
      message: 'コードをリファクタリング',
      reason: '複数ファイルが変更されている（リファクタリングの可能性）'
    });
  }
  
  // ドキュメントの推測
  if (allFiles.includes('.md') || allFiles.includes('readme') || allFiles.includes('doc')) {
    suggestions.push({ 
      type: 'docs', 
      confidence: 0.9,
      message: 'ドキュメントを更新',
      reason: 'ドキュメントファイルが変更されている'
    });
  }
  
  // テストの推測
  if (allFiles.includes('test') || allFiles.includes('spec') || allFiles.includes('spec.')) {
    suggestions.push({ 
      type: 'test', 
      confidence: 0.8,
      message: 'テストを追加/更新',
      reason: 'テストファイルが変更されている'
    });
  }
  
  // 設定ファイル等の推測
  if (allFiles.includes('package.json') || allFiles.includes('config') || 
      allFiles.includes('.yml') || allFiles.includes('.yaml')) {
    suggestions.push({ 
      type: 'chore', 
      confidence: 0.8,
      message: '設定ファイルを更新',
      reason: '設定ファイルが変更されている'
    });
  }
  
  // スタイル関連の推測
  if (allFiles.includes('.css') || allFiles.includes('.scss') || allFiles.includes('style')) {
    suggestions.push({ 
      type: 'style', 
      confidence: 0.8,
      message: 'スタイルを更新',
      reason: 'スタイルファイルが変更されている'
    });
  }
  
  // デフォルト提案
  if (suggestions.length === 0) {
    suggestions.push({ 
      type: 'chore', 
      confidence: 0.5,
      message: '変更内容を更新',
      reason: 'デフォルト提案'
    });
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence)[0];
}

async function smartCommit() {
  try {
    // 変更内容を分析
    const changes = analyzeChanges();
    
    if (!changes) {
      return;
    }
    
    // コミット情報を推測
    const suggestion = suggestCommitInfo(changes);
    
    console.log('💡 推奨されるコミット:');
    console.log(`  🏷️  タイプ: ${suggestion.type} (信頼度: ${Math.round(suggestion.confidence * 100)}%)`);
    console.log(`  📝 メッセージ: ${suggestion.message}`);
    console.log(`  📋 理由: ${suggestion.reason}`);
    console.log('');
    
    // ユーザーに確認
    const useRecommendation = await askQuestion(`推奨コミット「${suggestion.type}: ${suggestion.message}」を使用しますか？ (Y/n): `);
    
    let commitType, commitMessage;
    
    if (useRecommendation.toLowerCase() === 'n' || useRecommendation.toLowerCase() === 'no') {
      console.log('');
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
      commitType = types[parseInt(typeChoice) - 1] || 'chore';

      commitMessage = await askQuestion('コミットメッセージを入力してください: ');
      
      if (!commitMessage) {
        console.log('❌ コミットメッセージが入力されていません');
        process.exit(1);
      }
    } else {
      commitType = suggestion.type;
      commitMessage = suggestion.message;
    }
    
    // 自動プッシュするかどうか
    const autoPush = await askQuestion('自動プッシュしますか？ (y/N): ');
    
    // 完全なコミットメッセージを生成
    const fullMessage = `${commitType}: ${commitMessage}`;
    
    console.log('');
    console.log(`📝 コミット実行: ${fullMessage}`);
    
    // ステージングとコミット
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });
    
    console.log('✅ コミットが完了しました！');
    
    // 自動プッシュが選択された場合
    if (autoPush.toLowerCase() === 'y') {
      console.log('🚀 リモートにプッシュ中...');
      try {
        execSync('git push', { stdio: 'inherit' });
        console.log('✅ プッシュが完了しました！');
        console.log('');
        console.log('🚀 次のワークフロー:');
        console.log('  📝 PR作成: npm run pr:create');
        console.log('  🔄 PR更新: npm run pr:update');
        console.log('  📁 アーカイブ作成: npm run archive:create');
        console.log('');
        console.log('💡 ヒント:');
        console.log('  - 新しい機能の場合は PR作成を推奨');
        console.log('  - 既存PRの更新の場合は PR更新を使用');
        console.log('  - 作業完了時はアーカイブ作成で記録保存');
      } catch (error) {
        console.error('❌ プッシュに失敗しました:', error.message);
      }
    } else {
      console.log('');
      console.log('💡 次のステップ:');
      console.log('  1. git push でリモートにプッシュ');
      console.log('  2. プッシュ後のワークフロー:');
      console.log('     📝 PR作成: npm run pr:create');
      console.log('     🔄 PR更新: npm run pr:update');
      console.log('     📁 アーカイブ作成: npm run archive:create');
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
  smartCommit();
}

module.exports = { smartCommit };