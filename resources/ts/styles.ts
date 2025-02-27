import 'react-image-lightbox/style.css';
import 'react-phone-number-input/style.css';
import { css } from '@emotion/react';
import theme from 'src/Theme';

const globalStyles = css`
  html,
  body {
    width: 100vw;
  }
  html,
  body,
  #app {
    height: 100%;
  }
  #app > div {
    min-height: 100%;
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/Inter/Inter-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    src: url('/fonts/Inter/Inter-Bold.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 300;
    src: url('/fonts/Inter/Inter-Light.ttf') format('truetype');
  }

  .chakra-menu__menuitem-option > span {
    opacity: 1;
  }

  .chakra-toast {
    color: #ffffff;
  }

  /* override react-image-lightbox */
  .ril__caption,
  .ril__toolbar {
    background-color: transparent;
  }
  .ril__toolbar {
    height: auto;
    align-items: center;
  }
  .ril__toolbarSide {
    height: auto;
  }
  .ril__toolbarItem {
    line-height: normal;
  }
  .ril__navButtonPrev,
  .ril__navButtonNext {
    background-color: ${theme.colors.primary['700']};
    color: ${theme.colors.primary['50']};
  }
  .ril__navButtonPrev {
    margin-left: 50px;
  }
  .ril__navButtonNext {
    margin-right: 50px;
  }
  .ril__navButtons {
    background-size: 15px;
    padding: 20px 15px;
  }
  .ril__image {
    top: 100px;
  }
`;

export default globalStyles;
