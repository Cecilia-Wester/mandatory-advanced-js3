import React from 'react';
import {SocialMediaIconsReact} from 'social-media-icons-react';

export default class Footer extends React.Component {
    render(){
        return(
            <div className='footerSocialMediaIcons'>
            <p><SocialMediaIconsReact icon="github" url="https://github.com/Cecilia-Wester" backgroundColor='#686868' /></p>
            <p><SocialMediaIconsReact icon='instagram' url='https://instagram.com' backgroundColor='#686868' /></p>
            <p><SocialMediaIconsReact icon='facebook' url='https://facebook.com' backgroundColor='#686868' /></p>
            </div>
        )
    }
}