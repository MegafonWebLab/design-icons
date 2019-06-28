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
        const sizeless = !!Number(iconContainer.dataset.sizeless);
        const html = [];

        sizes.forEach(size => {
            const s = Number(size.size) * 2;
            const downloadSizeTitle = sizeless ? '' : ` ${size.size}px`;

            html.push(`
                <div class="icons__info-icon-container">
                    <a class="icons__download" href="icons/${size.fullPath}" download>
                        <img src="icons/${size.fullPath}" width="${s}px" height="${s}px" />
                        <div class="icons__info-icon-download-container">
                            скачать${downloadSizeTitle}
                        </div>
                    </a>
                </div>`);
        });

        wrapper.innerHTML = html.join('');
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
