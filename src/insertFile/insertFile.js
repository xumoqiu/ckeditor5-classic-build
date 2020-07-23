import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ui from './insertFileUI'
import edit from './insertFileEditing'



export default class InsertFile extends Plugin {

	static get pluginName() {
		return 'InsertFile';
	}

	static get requires() {
		return [ui, edit];
	}
}
