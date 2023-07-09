const calculateSymbolCount = (value) => {
    return value.blocks
        .reduce((acc, el) => {
            if (el.type === 'paragraph') {
                acc += el.data.text;
            } else if ('list' === el.type) {
                acc += el.data.items.join();
            }
            return acc
        }, '')
        .replace(/[^А-яЁёA-Za-z1-9]/g, "")
        .trim()
        .length;
}

export default calculateSymbolCount;
