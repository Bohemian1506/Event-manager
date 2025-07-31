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

async function analyzeWorkContext() {
  console.log('🤖 Claude連携型スマートワークフロー');
  console.log('📊 作業内容を分析中...');
  console.log('');

  try {
    // 現在のブランチ情報を取得
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    // 最近のコミット履歴を取得
    const recentCommits = execSync('git log --oneline -n 5', { encoding: 'utf8' });
    
    // 変更されたファイルがあるかチェック
    const hasChanges = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    
    console.log(`📍 現在のブランチ: ${currentBranch}`);
    console.log('📝 最近のコミット:');
    console.log(recentCommits);
    
    if (hasChanges) {
      console.log('⚠️  未コミットの変更があります:');
      execSync('git status --short', { stdio: 'inherit' });
      console.log('');
    }

    return {
      currentBranch,
      recentCommits,
      hasChanges: !!hasChanges
    };
  } catch (error) {
    console.error('❌ Git情報の取得に失敗しました:', error.message);
    return null;
  }
}

function suggestBranchInfo(context) {
  // シンプルな推測ロジック（後でClaude APIに置き換える予定）
  const suggestions = [];
  
  if (context && context.recentCommits) {
    const commits = context.recentCommits.toLowerCase();
    
    if (commits.includes('fix') || commits.includes('bug')) {
      suggestions.push({ type: 'fix', confidence: 0.7, reason: '最近のコミットにfixやbugが含まれている' });
    }
    
    if (commits.includes('feat') || commits.includes('add')) {
      suggestions.push({ type: 'feature', confidence: 0.8, reason: '最近のコミットにfeatやaddが含まれている' });
    }
    
    if (commits.includes('refactor') || commits.includes('improve')) {
      suggestions.push({ type: 'refactor', confidence: 0.7, reason: '最近のコミットにrefactorやimproveが含まれている' });
    }
    
    if (commits.includes('docs') || commits.includes('document')) {
      suggestions.push({ type: 'docs', confidence: 0.8, reason: '最近のコミットにdocsやdocumentが含まれている' });
    }
  }
  
  // デフォルト提案
  if (suggestions.length === 0) {
    suggestions.push({ type: 'feature', confidence: 0.5, reason: 'デフォルト提案' });
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

async function smartWorkStart() {
  try {
    console.log('🚀 EventPay Manager - Claude連携型スマートワークフロー');
    console.log('');

    // 作業コンテキストを分析
    const context = await analyzeWorkContext();
    
    // ブランチ情報を推測
    const suggestions = suggestBranchInfo(context);
    const topSuggestion = suggestions[0];
    
    console.log('💡 推奨される作業タイプ:');
    console.log(`  🎯 ${topSuggestion.type} (信頼度: ${Math.round(topSuggestion.confidence * 100)}%)`);
    console.log(`  📋 理由: ${topSuggestion.reason}`);
    console.log('');
    
    // ユーザーに確認
    const useRecommendation = await askQuestion(`推奨タイプ「${topSuggestion.type}」を使用しますか？ (Y/n): `);
    
    let branchType;
    if (useRecommendation.toLowerCase() === 'n' || useRecommendation.toLowerCase() === 'no') {
      console.log('');
      console.log('利用可能なタイプ:');
      console.log('1. feature (新機能)');
      console.log('2. fix (バグ修正)');
      console.log('3. refactor (リファクタリング)');
      console.log('4. docs (ドキュメント)');
      console.log('5. test (テスト)');
      console.log('6. chore (その他)');
      
      const typeChoice = await askQuestion('選択 (1-6): ');
      const types = ['feature', 'fix', 'refactor', 'docs', 'test', 'chore'];
      branchType = types[parseInt(typeChoice) - 1] || 'feature';
    } else {
      branchType = topSuggestion.type;
    }
    
    // タスク名を入力
    const taskDescription = await askQuestion('タスクの説明を入力してください: ');
    
    if (!taskDescription) {
      console.log('❌ タスクの説明が入力されていません');
      process.exit(1);
    }
    
    console.log('');
    console.log('🔄 既存のwork:startスクリプトを実行します...');
    console.log('');
    
    // 既存のwork-start-cliスクリプトを呼び出し
    const { workStartCli } = require('./work-start-cli.js');
    await workStartCli(branchType, taskDescription);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// メイン実行
if (require.main === module) {
  smartWorkStart();
}

module.exports = { smartWorkStart };