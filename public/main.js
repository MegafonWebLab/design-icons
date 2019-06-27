(function (document) {
    let lastActive;

    function onIconClick(iconContainer) {
        const info = document.querySelector('.icons_info');
        info.classList.add('icons_info_shown');

        if (lastActive) {
            lastActive.classList.remove('icons_container_active');
        }

        iconContainer.classList.add('icons_container_active');
        lastActive = iconContainer;

        const wrapper = document.querySelector('.icons__info-icon-wrapper');
        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.firstChild);
        }

        const sizes = JSON.parse(iconContainer.dataset.sizes);

        sizes.forEach(size => {
            const s = Number(size.size) * 2;
            const el = document.createElement('img');
            el.setAttribute('src', `icons/${size.fullPath}`);
            el.style.width = `${s}px`;
            el.style.height = `${s}px`;
            wrapper.appendChild(el);
        });
    }

    const e = document.querySelector('.icons__info-close');
    e.addEventListener('click', function () {
        const info = document.querySelector('.icons_info');
        info.classList.remove('icons_info_shown');
    });

    document.addEventListener('click', function (event) {
        const closestContainer = event.target.closest('.icons_container');
        if (closestContainer) {
            onIconClick(closestContainer);
        }
    }, false);
}(document));
