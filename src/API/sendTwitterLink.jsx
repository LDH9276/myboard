import axios from 'axios';

// Write에서 보내는 Twitter 링크를 처리해서  react-twitter-widgets 위젯으로 보내기
export const sendTwitterLink = async (link) => {

    const url = link.replace('</span>', '');
    const filteredLink = url.replace('https://x.com/', 'https://twitter.com/');

    try {
        const response = await axios.get(`https://publish.twitter.com/oembed?url=${filteredLink}`);
        console.log(response);
        // return response.data.html;
    } catch (error) {
        console.error(error);
        return 'Error fetching tweet';
    }
}