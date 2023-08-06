export default class Toast {
    public notes = ref([])

    public setNote(payload: object) {
        this.notes.value.unshift(payload);
    }
    public clearNote() {
        this.notes.value.splice(this.notes.value.length - 1, 1);
    }
    public deleteNote(index: number) {
        this.notes.value.splice(index, 1);
    }
    public setSuccess(message: string, timeOut = 5000) {
        this.setNote({ status: 'success', message });
        setTimeout(() => {
            this.clearNote();
        }, timeOut);
    }
    public setError(message: string, timeOut = 5000) {
        this.setNote({ status: 'error', message });
        setTimeout(() => {
            this.clearNote();
        }, timeOut);
    }
}
