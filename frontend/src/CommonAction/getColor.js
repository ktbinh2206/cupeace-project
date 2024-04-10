export function getAverageColor(imageElement, ratio) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const handleImageLoad = () => {
        const height = canvas.height = imageElement.naturalHeight;
        const width = canvas.width = imageElement.naturalWidth;

        context.drawImage(imageElement, 0, 0);

        let data, length;
        let i = -4, count = 0;

        try {
            data = context.getImageData(0, 0, width, height);
            length = data.data.length;
        } catch (err) {
            console.error(err);
            return { R: 0, G: 0, B: 0 };
        }

        let R = 0, G = 0, B = 0;

        while ((i += ratio * 4) < length) {
            ++count;
            R += data.data[i];
            G += data.data[i + 1];
            B += data.data[i + 2];
        }

        R = ~~(R / count);
        G = ~~(G / count);
        B = ~~(B / count);
        return { R, G, B };
    };


    return handleImageLoad();
}
export function getTextColor({ R, G, B }) {
    // Convert the RGB components to a brightness value
    const brightness = (R * 299 + G * 587 + B * 114) / 1000;

    // Use a threshold to determine if the color is light or dark
    return brightness > 125 ? 'black' : 'white';
}