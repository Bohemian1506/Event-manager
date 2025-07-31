#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    dateJP: `${year}年${month}月${day}日`,
    filename: `${year}-${month}-${day}`
  };
}

function getGitInfo() {
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    const lastCommit = execSync('git log -1 --pretty=format:"%h %s"', { encoding: 'utf-8' }).trim();
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' }).trim().split('\n').filter(f => f);
    
    return {
      branch: currentBranch,
      lastCommit,
      changedFiles
    };
  } catch (error) {
    console.warn('Git情報の取得に失敗しました:', error.message);
    return {
      branch: 'unknown',
      lastCommit: 'unknown',
      changedFiles: []
    };
  }
}

function detectWorkType(gitInfo) {
  const { branch, lastCommit } = gitInfo;
  
  if (branch.startsWith('feature/')) return '新機能実装';
  if (branch.startsWith('fix/')) return 'バグ修正';
  if (branch.startsWith('refactor/')) return 'リファクタリング';
  if (branch.startsWith('docs/')) return 'ドキュメント更新';
  if (branch.startsWith('test/')) return 'テスト実装';
  if (branch.startsWith('chore/')) return '環境設定・ツール改善';
  
  if (lastCommit.includes('feat:')) return '新機能実装';
  if (lastCommit.includes('fix:')) return 'バグ修正';
  if (lastCommit.includes('docs:')) return 'ドキュメント更新';
  if (lastCommit.includes('refactor:')) return 'リファクタリング';
  if (lastCommit.includes('test:')) return 'テスト実装';
  if (lastCommit.includes('chore:')) return '環境設定・ツール改善';
  
  return '一般作業';
}

function categorizeFiles(files) {
  const categories = {
    ruby: [],
    javascript: [],
    erb: [],
    config: [],
    docs: [],
    other: []
  };
  
  files.forEach(file => {
    if (file.endsWith('.rb')) categories.ruby.push(file);
    else if (file.endsWith('.js') || file.endsWith('.ts')) categories.javascript.push(file);
    else if (file.endsWith('.erb')) categories.erb.push(file);
    else if (file.includes('config/') || file.endsWith('.yml') || file.endsWith('.yaml') || file.endsWith('.json')) categories.config.push(file);
    else if (file.endsWith('.md') || file.includes('docs/')) categories.docs.push(file);
    else categories.other.push(file);
  });
  
  return categories;
}

function generateArchiveContent(datetime, gitInfo, workType, fileCategories) {
  const { date, dateJP, time } = datetime;
  const { branch, lastCommit, changedFiles } = gitInfo;
  
  let content = `# 作業サマリー - ${date}

## 作業概要
- **作業タイトル**: ${workType}
- **実行日時**: ${dateJP} (${time})
- **作業者**: Claude Code + User
- **ブランチ**: \`${branch}\`
- **最新コミット**: ${lastCommit}

## 実施内容

### 作成・修正したファイル
`;

  // ファイル変更テーブル
  if (changedFiles.length > 0) {
    content += `| ファイル名 | カテゴリ | 変更内容 |\n`;
    content += `|-----------|---------|----------|\n`;
    
    changedFiles.forEach(file => {
      let category = 'その他';
      if (file.endsWith('.rb')) category = 'Ruby';
      else if (file.endsWith('.js') || file.endsWith('.ts')) category = 'JavaScript';
      else if (file.endsWith('.erb')) category = 'View';
      else if (file.includes('config/') || file.endsWith('.yml') || file.endsWith('.json')) category = '設定';
      else if (file.endsWith('.md') || file.includes('docs/')) category = 'ドキュメント';
      
      content += `| \`${file}\` | ${category} | 変更 |\n`;
    });
  } else {
    content += `変更されたファイルはありません。\n`;
  }

  content += `
### ファイル変更統計
- **総変更ファイル数**: ${changedFiles.length}
- **Rubyファイル**: ${fileCategories.ruby.length}件
- **JavaScriptファイル**: ${fileCategories.javascript.length}件
- **ビューファイル**: ${fileCategories.erb.length}件
- **設定ファイル**: ${fileCategories.config.length}件
- **ドキュメント**: ${fileCategories.docs.length}件

## 技術的成果

### 実装内容
- ${workType}の実装完了

### 主要変更点
`;

  // カテゴリ別の詳細
  if (fileCategories.ruby.length > 0) {
    content += `
#### Rubyファイルの変更
`;
    fileCategories.ruby.forEach(file => {
      content += `- \`${file}\`: 機能追加・修正\n`;
    });
  }

  if (fileCategories.javascript.length > 0) {
    content += `
#### JavaScriptファイルの変更
`;
    fileCategories.javascript.forEach(file => {
      content += `- \`${file}\`: フロントエンド機能追加・修正\n`;
    });
  }

  if (fileCategories.erb.length > 0) {
    content += `
#### ビューファイルの変更
`;
    fileCategories.erb.forEach(file => {
      content += `- \`${file}\`: UI/UX改善\n`;
    });
  }

  if (fileCategories.config.length > 0) {
    content += `
#### 設定ファイルの変更
`;
    fileCategories.config.forEach(file => {
      content += `- \`${file}\`: 環境設定・自動化設定\n`;
    });
  }

  if (fileCategories.docs.length > 0) {
    content += `
#### ドキュメントの更新
`;
    fileCategories.docs.forEach(file => {
      content += `- \`${file}\`: ドキュメント更新・追加\n`;
    });
  }

  content += `
## 開発プロセス

### 使用したワークフロー
- \`npm run work:start\`: 作業開始の自動化
- \`npm run dev:commit\`: 対話式コミット
- 自動PR作成: GitHubワークフローによる自動化

### 品質チェック
- pre-pushフック: RuboCop, RSpec, Brakeman
- 自動化スクリプトによる一貫した開発プロセス

## Git操作記録
- **ブランチ**: \`${branch}\`
- **コミット**: ${lastCommit}
- **変更ファイル数**: ${changedFiles.length}件

## 次回作業での改善点

### 継続すべき点
- 自動化ワークフローの活用
- 一貫したコミットメッセージ
- 段階的な実装・コミット

### 検討事項
- より効率的な実装方法の検討
- テストカバレッジの向上
- ドキュメントの継続的な改善

## 参考リンク
- [開発ルール](../setup/development-rules.md)
- [Claude Code自動ワークフロー](../workflows/claude-code-workflow.md)
- [AI開発ルール](../ai-development/ai-development-rules.md)

---
*作成者: Claude Code*  
*作成日時: ${date} ${time}*  
*自動生成: \`npm run archive:create\`*
`;

  return content;
}

function main() {
  try {
    console.log('📚 作業サマリーを生成しています...');
    
    const datetime = getCurrentDateTime();
    const gitInfo = getGitInfo();
    const workType = detectWorkType(gitInfo);
    const fileCategories = categorizeFiles(gitInfo.changedFiles);
    
    console.log(`🎯 作業タイプ: ${workType}`);
    console.log(`📁 変更ファイル数: ${gitInfo.changedFiles.length}件`);
    
    const archiveContent = generateArchiveContent(datetime, gitInfo, workType, fileCategories);
    
    // アーカイブディレクトリの確認・作成
    const archiveDir = path.join(__dirname, '..', 'docs', 'archives');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
      console.log('📂 archivesディレクトリを作成しました');
    }
    
    // ファイル名の生成（重複回避）
    let filename = `${datetime.filename}.md`;
    let counter = 1;
    while (fs.existsSync(path.join(archiveDir, filename))) {
      filename = `${datetime.filename}-${counter}.md`;
      counter++;
    }
    
    const filePath = path.join(archiveDir, filename);
    fs.writeFileSync(filePath, archiveContent, 'utf-8');
    
    console.log('✅ 作業サマリーを作成しました');
    console.log(`📄 ファイル: docs/archives/${filename}`);
    console.log('🎉 アーカイブ作成完了！');
    
  } catch (error) {
    console.error('❌ アーカイブ作成中にエラーが発生しました:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };