import Title from 'antd/lib/typography/Title'
import React from 'react'

const ProductTitle = ({children}) => {
  return <Title level={5} ellipsis={{rows: 3, expandable: false}}>{children}</Title>
}

export default ProductTitle
