const loadDraggableTittleBar = () => {

    const titlebar = document.createElement('div');

    titlebar.id = 'draggable_titlebar';
	
	titlebar.style.width = '100%';
	titlebar.style.height = '35px';
	titlebar.style['-webkit-app-region'] = 'drag';

    document.body.appendChild(titlebar);

}

loadDraggableTittleBar();