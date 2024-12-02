import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.findNodeModule',
    async () => {
      // 获取当前工作区的node_modules目录路径
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showInformationMessage('No workspace folder found');
        return;
      }
      const nodeModulesPath = path.join(
        workspaceFolders[0].uri.fsPath,
        'node_modules'
      );

      // 读取node_modules目录下的所有模块名称
      const modules = fs.readdirSync(nodeModulesPath).filter((item) => {
        const itemPath = path.join(nodeModulesPath, item);
        return fs.statSync(itemPath).isDirectory();
      });

      // 使用QuickPick显示模块名称的下拉列表
      const moduleName = await vscode.window.showQuickPick(modules, {
        placeHolder: 'Select a node module',
      });

      if (!moduleName) {
        vscode.window.showInformationMessage('No module selected');
        return;
      }

      // 构建模块的完整路径
      const modulePath = path.join(nodeModulesPath, moduleName);
      const uri = vscode.Uri.file(modulePath);

      // 在侧边栏的资源管理器中显示模块
      vscode.commands.executeCommand('revealInExplorer', uri);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
