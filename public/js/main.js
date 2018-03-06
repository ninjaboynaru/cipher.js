const Vue = require('vue/dist/vue.common.js');
const cipher = require('../js/cipher.js');

/*
* Possible app sections
* HOME
* ABOUT
*/
/*
* Possible app states
* INITIAL
* PROCESSING
* DONE
*/


const app = new Vue({
	el: '#main',
	data: {
		'section': 'HOME',
		state: 'INITIAL',
		message: '',
		error: ''
	},
	methods: {
		onFilesSubmit: function onFilesSubmit(event) {
			event.preventDefault();

			let fileInput = event.target['fileInput'].value;
			let fileOutput = event.target['fileOutput'].value;

			if(fileInput != false && fileOutput != false) {
				this.setState('PROCESSING');
				try
				{
					cipher(fileInput, fileOutput, this.onDataCiphered.bind(this));
				}
				catch(error) {
					console.log(error);
					this.setState('DONE');
					this.error = true;
				}
			}
			else {
				this.message = 'Please select both an input and output file';
			}
		},

		onDataCiphered: function onDataCiphered(error, handle) {
			if(error) {
				this.error = true;
			}
			this.setState('DONE');
		},

		setSection: function setSection(section) {
			this.message = '';
			this.error = false;
			this.section = section;
		},
		setState: function setState(state) {
			this.message = '';
			this.error = false;
			this.state = state;
		}
	},
	created: function onCreated() {
		window.addEventListener('error', function(){
			this.error = true;
		}.bind(this));

		// simulate messages or errors using keyboard shortcuts
		window.addEventListener('keydown', function(event){
			if(event.altKey && event.ctrlKey) {
				if(event.key === 'q') {
					// simulate a message
					if(this.message) {
						this.message = '';
					}
					else {
						this.message = 'I am a test message. Hello.';
					}
				}
				else if(event.key === 'w') {
					// simulate the error flag
					this.error = !this.error;
				}
				else if(event.key === 'e') {
					// simulate an error throw
					throw new Error('I am a test error');
				}
			}
		}.bind(this));
	}
});
