import axios from "axios";

async function CustomuseApi({ Url, method = 'GET', data = {}, params = {}, headers = {} }) {
    try {
        const res = await axios({
            url: "http://localhost:3000/api/" + Url,
            method,
            data,
            params,
            headers,
        });

        return res.data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}


export default CustomuseApi;
