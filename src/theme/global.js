import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .card-body{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .style_topbar__1Hm7i{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .style_breadcrumbs__1Xcsk{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .ant-table-placeholder{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .ant-input{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .ant-btn{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .ant-btn-primary{
    background: ${({ theme }) => theme.backgroudGray};
    color: ${({ theme }) => theme.buttonsYellow};
    transition: all 0.25s linear;
  }
  .ant-form-item-required{
    color: ${({ theme }) => theme.dangerButtons};
    transition: all 0.25s linear;
  }
  `
