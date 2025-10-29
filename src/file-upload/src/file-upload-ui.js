/* global document */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import relFileIcon from './relFile.svg';

export default class fileUploadUI extends Plugin {
	/**
     * @inheritDoc
     *left:calc((100% - 100px) / 2);display:flex;justify-content:center;-webkit-display:flex;
     */
	init() {
		const nowStyle = document.createElement( 'style' );
		nowStyle.type = 'text/css';
		const containerStyles = '#ckeditorWarningMessageContainer{ position: absolute;right: 1%;margin-top: 10px; }';
		const messageStyles = '#ckeditorWarningMessage{max-width:300px;min-height:20px;line-height:20px;' +
			'border-radius:4px;font-size:14px;border:1px solid #EBEEF5;color:red;padding:12px 15px 11px 40px;' +
			'background:#EDF2FC url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAP1BMVEVHcEySlpuQlJmRl' +
			'JmQk5mRk5mSlJqcpKSWlp6Qk5mQk5mRlJmQk5mmqK27vMDCxMeQk5mUlJ+Ym6Hu7u+Rk5kG3YcQAAAAFXRSTlMALG2XrYdOBx7/3Dfq////9Bj//8kN56x+' +
			'AAAAZ0lEQVR4AV2PhQHEMAhFf+Pu+696AvUXxQHEJqTSxoKBU54IBkRM/kCTneRcSCMAsH+u9LQO54mRjyDBnzr5XdBPRYJ8Kto7JGB7KiSwHooIxLtC' +
			'4oe4+lg8nzmGkce8VqiQlt7w4wsT2gfrxx2WRQAAAABJRU5ErkJggg==\') no-repeat 15px center;' +
			'background-size:16px auto;z-index:8888;word-break: break-word;}';
		const styles = containerStyles + ' ' + messageStyles;
		nowStyle.innerText = styles;
		document.body.appendChild( nowStyle );
		const editor = this.editor;

		editor.ui.componentFactory.add( 'fileUpload', locale => {
			const button = new ButtonView( locale );
			button.set( {
				label: 'file upload',
				isOn: false,
				class: 'fileUpload',
				tooltip: true,
				icon: relFileIcon,
				isEnabled: true
			} );
			this.listenTo( button, 'execute', () =>
				editor.execute( 'insertFileUploadBox' )
			);
			return button;
		} );
	}
}
