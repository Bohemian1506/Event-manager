#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// PRタイトルとボディを自動生成する関数
function generatePRContent() {
  try {
    // 現在のブランチ名を取得
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    
    // mainブランチとの差分でコミット履歴を取得
    const commits = execSync(`git log main..${currentBranch} --oneline`, { encoding: 'utf8' }).trim();
    
    if (!commits) {
      return {
        title: `WIP: ${currentBranch}`,
        body: 'Auto-generated pull request'
      };
    }
    
    const commitLines = commits.split('\n').filter(line => line.trim());
    
    // ブランチ名からタイトルを生成
    const title = generatePRTitle(currentBranch, commitLines);
    
    // コミット内容からボディを生成
    const body = generatePRBody(commitLines, currentBranch);
    
    return { title, body };
  } catch (error) {
    console.error('PR内容生成エラー:', error.message);
    return {
      title: 'Auto-generated PR',
      body: 'Auto-generated pull request'
    };
  }
}

function generatePRTitle(branchName, commitLines) {
  // ブランチ名から基本タイトルを生成
  const branchParts = branchName.split('/');
  const type = branchParts[0] || 'feat';
  const feature = branchParts[1] || 'update';
  
  // 最新のコミットメッセージから詳細を取得
  if (commitLines.length > 0) {
    const latestCommit = commitLines[0];
    const commitMessage = latestCommit.split(' ').slice(1).join(' ');
    
    // コミットメッセージがConventional Commitsの場合
    if (commitMessage.includes(':')) {
      return commitMessage;
    }
    
    return `${type}: ${commitMessage}`;
  }
  
  // フォールバック: ブランチ名から生成
  const titleMap = {
    'feat': 'feat',
    'feature': 'feat',
    'fix': 'fix',
    'bugfix': 'fix',
    'docs': 'docs',
    'test': 'test',
    'refactor': 'refactor',
    'style': 'style',
    'chore': 'chore'
  };
  
  const prefix = titleMap[type] || 'feat';
  const description = feature.replace(/-/g, ' ');
  
  return `${prefix}: ${description}`;
}

function generatePRBody(commitLines, branchName) {
  const sections = [];
  
  // 概要セクション
  sections.push('## 概要');
  sections.push('このプルリクエストの変更内容を説明してください。');
  sections.push('');
  
  // 変更内容セクション
  if (commitLines.length > 0) {
    sections.push('## 変更内容');
    commitLines.forEach(commit => {
      const commitMessage = commit.split(' ').slice(1).join(' ');
      sections.push(`- ${commitMessage}`);
    });
    sections.push('');
  }
  
  // 変更されたファイルの分析
  try {
    const changedFiles = execSync('git diff --name-only main...HEAD', { encoding: 'utf8' }).trim();
    if (changedFiles) {
      const files = changedFiles.split('\n');
      const fileAnalysis = analyzeChangedFiles(files);
      
      if (fileAnalysis.length > 0) {
        sections.push('## 影響範囲');
        fileAnalysis.forEach(analysis => {
          sections.push(`- **${analysis.category}**: ${analysis.description}`);
        });
        sections.push('');
      }
    }
  } catch (error) {
    // ファイル分析に失敗した場合は無視
  }
  
  // テストセクション
  sections.push('## テスト');
  sections.push('- [ ] 機能テスト実行済み');
  sections.push('- [ ] 単体テスト実行済み');
  sections.push('- [ ] 手動テスト実行済み');
  sections.push('');
  
  // チェックリスト
  sections.push('## チェックリスト');
  sections.push('- [ ] コードレビュー準備完了');
  sections.push('- [ ] ドキュメント更新済み（必要に応じて）');
  sections.push('- [ ] 後方互換性を確認済み');
  sections.push('');
  
  // 自動生成フッター
  sections.push('---');
  sections.push('🤖 このPR本文は自動生成されました');
  
  return sections.join('\n');
}

function analyzeChangedFiles(files) {
  const analysis = [];
  const categories = {
    controllers: { count: 0, files: [] },
    models: { count: 0, files: [] },
    views: { count: 0, files: [] },
    tests: { count: 0, files: [] },
    docs: { count: 0, files: [] },
    config: { count: 0, files: [] },
    assets: { count: 0, files: [] },
    scripts: { count: 0, files: [] },
    other: { count: 0, files: [] }
  };
  
  files.forEach(file => {
    if (file.includes('_controller.rb') || file.includes('/controllers/')) {
      categories.controllers.count++;
      categories.controllers.files.push(file);
    } else if (file.includes('/models/') || (file.includes('.rb') && !file.includes('/config/') && !file.includes('_controller.rb'))) {
      categories.models.count++;
      categories.models.files.push(file);
    } else if (file.includes('/views/') || file.includes('.erb')) {
      categories.views.count++;
      categories.views.files.push(file);
    } else if (file.includes('_test.') || file.includes('_spec.') || file.includes('/test/') || file.includes('/spec/')) {
      categories.tests.count++;
      categories.tests.files.push(file);
    } else if (file.includes('.md') || file.includes('/docs/')) {
      categories.docs.count++;
      categories.docs.files.push(file);
    } else if (file.includes('/config/') || file.includes('.yml') || file.includes('.yaml') || file.includes('.json')) {
      categories.config.count++;
      categories.config.files.push(file);
    } else if (file.includes('/assets/') || file.includes('.css') || file.includes('.scss') || file.includes('.js')) {
      categories.assets.count++;
      categories.assets.files.push(file);
    } else if (file.includes('/scripts/') || file === 'package.json') {
      categories.scripts.count++;
      categories.scripts.files.push(file);
    } else {
      categories.other.count++;
      categories.other.files.push(file);
    }
  });
  
  Object.entries(categories).forEach(([key, data]) => {
    if (data.count > 0) {
      const descriptions = {
        controllers: `${data.count}個のコントローラーファイル`,
        models: `${data.count}個のモデルファイル`,
        views: `${data.count}個のビューファイル`,
        tests: `${data.count}個のテストファイル`,
        docs: `${data.count}個のドキュメントファイル`,
        config: `${data.count}個の設定ファイル`,
        assets: `${data.count}個のアセットファイル`,
        scripts: `${data.count}個のスクリプトファイル`,
        other: `${data.count}個のその他ファイル`
      };
      
      analysis.push({
        category: key.charAt(0).toUpperCase() + key.slice(1),
        description: descriptions[key]
      });
    }
  });
  
  return analysis;
}

// メイン実行関数
async function createPR() {
  try {
    console.log('🔍 PR内容を自動生成中...');
    
    const prContent = generatePRContent();
    
    console.log('\n📋 生成されたPR内容:');
    console.log(`タイトル: ${prContent.title}`);
    console.log('\n--- PR本文 ---');
    console.log(prContent.body);
    console.log('--- PR本文終了 ---\n');
    
    // PRを作成
    console.log('🚀 プルリクエストを作成中...');
    
    // エスケープして実行
    const escapedTitle = prContent.title.replace(/"/g, '\\"');
    const escapedBody = prContent.body.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    const command = `gh pr create --title "${escapedTitle}" --body "${escapedBody}"`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ プルリクエストが作成されました！');
    
  } catch (error) {
    console.error('❌ PR作成エラー:', error.message);
    process.exit(1);
  }
}

// メイン実行
if (require.main === module) {
  createPR();
}

module.exports = { generatePRContent, createPR };