// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

// declare global {
// 	interface Window {
// 		electronAPI: any;
// 	}
// }

contextBridge.exposeInMainWorld('electronAPI', {
	// fileOps
	// clearCachedPaths: () => ipcRenderer.send('clear-cached-paths'),
	// save: (content) => ipcRenderer.send('save', content),
	// saveAs: (content) => ipcRenderer.send('save-as', content),
	// write: (filePath, content) => ipcRenderer.send('write', filePath, content),
	// read: (filePath) => ipcRenderer.invoke('read', filePath),
	// readFiles: (folderPath, exts, option) =>
	// 	ipcRenderer.invoke('read-files', folderPath, exts, option),
	// load: () => ipcRenderer.invoke('load'),
	// selectFolder: (folderPath) => ipcRenderer.invoke('select-folder', folderPath),

	// // socketTest
	// socketSend: (data) => ipcRenderer.send('socket-send', data),
	// socketRead: () => ipcRenderer.invoke('socket-read'),
	// loadAssets: () => ipcRenderer.invoke('load-assets'),
	// onLoadDirAssetsFinish: (callback) =>
	// 	ipcRenderer.on('load-dir-assets-finish', (event, path) => callback(path)),
	// onLoadAssetsFinish: (callback) => ipcRenderer.on('load-assets-finish', (event) => callback()),

	// // ipcElectron
	// connect: () => ipcRenderer.send('connect'),
	// sendToUE: (data) => ipcRenderer.send('send-to-ue', data),
	// getFromUE: (callback) => ipcRenderer.on('get-from-ue', (event, data) => callback(data)),
	// onConnectUpdate: (callback) =>
	// 	ipcRenderer.on('connect-update', (event, isConnected) => callback(isConnected)),
	// checkConnect: () => ipcRenderer.invoke('check-connect'),
	// openNewWindow: () => ipcRenderer.send('open-new-window'),
	// getAppPath: () => ipcRenderer.invoke('get-app-path'),
});
