import ui from './fileSelectUI'
import edit from './fileSelectEditing'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class FileSelect extends Plugin {

	static get pluginName() {
		return 'FileSelect';
	}

	static get requires() {
		return [ui, edit];
	}
}
