import axios from 'axios';

export default {
    async render() {
        const res = await axios.get('/api/users');

        return (res.data || []).map((value) => {
            return `<div>${value.id} : ${value.name}</div>`
        }).join("-----");
    }
}