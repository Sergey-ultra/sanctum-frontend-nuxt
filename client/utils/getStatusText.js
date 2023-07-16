const getStatusText = status => {
    switch (status) {
        case 'published':
            return 'Опубликовано';
        case 'rejected':
            return 'Отклонено';
        case 'moderated':
            return 'На модерации';
        case 'draft':
            return 'Черновик';
    }
}

export default getStatusText;
