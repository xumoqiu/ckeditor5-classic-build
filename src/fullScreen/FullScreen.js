/* global document, console */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageFullBig from './icons/fullscreen-big.svg';
import ImageFullCancel from './icons/fullscreen-cancel.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import './css/style.css';

export default class FullScreen extends Plugin {
	init() {
		const editor = this.editor;
		this.isFullScreen = false;
		this.buttonView = null;

		// Bind ESC key handler
		this._handleEscKey = this._handleEscKey.bind( this );
		document.addEventListener( 'keydown', this._handleEscKey );

		editor.ui.componentFactory.add( 'fullScreen', locale => {
			const view = new ButtonView( locale );
			this.buttonView = view;

			view.set( {
				label: 'Full Screen',
				icon: ImageFullBig,
				tooltip: true
			} );

			// Callback executed once the button is clicked.
			view.on( 'execute', () => {
				this.toggleFullScreen( view );
			} );

			return view;
		} );
	}

	_handleEscKey( event ) {
		// Exit full screen when ESC key is pressed
		if ( event.key === 'Escape' && this.isFullScreen ) {
			this.toggleFullScreen( this.buttonView );
		}
	}

	toggleFullScreen( view ) {
		const editor = this.editor;
		const editorElement = editor.ui.view.element;

		if ( !editorElement ) {
			console.error( 'Editor element not found' );
			return;
		}

		if ( this.isFullScreen ) {
			// Exit full screen
			editorElement.classList.remove( 'fullscreeneditor' );
			document.body.classList.remove( 'fullscreenoverlay' );
			view.set( {
				label: 'Full Screen',
				icon: ImageFullBig,
				tooltip: true
			} );
			this.isFullScreen = false;
		} else {
			// Enter full screen
			editorElement.classList.add( 'fullscreeneditor' );
			document.body.classList.add( 'fullscreenoverlay' );
			view.set( {
				label: 'Exit Full Screen',
				icon: ImageFullCancel,
				tooltip: true
			} );
			this.isFullScreen = true;
		}
	}

	destroy() {
		// Remove ESC key event listener
		document.removeEventListener( 'keydown', this._handleEscKey );

		// Cleanup: exit full screen if currently in full screen mode
		if ( this.isFullScreen ) {
			const editorElement = this.editor.ui.view.element;
			if ( editorElement ) {
				editorElement.classList.remove( 'fullscreeneditor' );
			}
			document.body.classList.remove( 'fullscreenoverlay' );
		}
		super.destroy();
	}
}
