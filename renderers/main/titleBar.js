const loadDraggableTittleBar = () => {

    const titlebar = document.createElement('div');

    titlebar.id = 'draggable_titlebar';
	
	titlebar.style.width = '100%';
	titlebar.style.height = '50px';
    titlebar.style.top = '0%';
    titlebar.style.position = 'absolute';
	titlebar.style['-webkit-app-region'] = 'drag';

    document.body.appendChild(titlebar);

}

loadDraggableTittleBar();