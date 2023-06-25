export default class Toast {
    public notes = ref([])

    public setNote(object) {
        console.log( this.notes.value, object);
        this.notes.value.unshift(object);
    }
    public clearNote() {
        this.notes.value.splice(this.notes.value.length - 1, 1);
    }
    public deleteNote(index) {
        this.notes.value.splice(index, 1);
    }
    public setSuccess(message, timeOut = 5000) {
        this.setNote({ status: 'success', message });
        setTimeout(() => {
            this.clearNote();
        }, timeOut);
    }
    public setError(message, timeOut = 5000) {
        this.setNote({ status: 'error', message });
        setTimeout(() => {
            this.clearNote();
        }, timeOut);
    }
}
