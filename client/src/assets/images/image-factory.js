const img = ["https://cdn.fptshop.com.vn/Uploads/Originals/2020/12/4/637426754540310489_asus-vivobook-a415-bac-dd-1.png",
"https://phucanhcdn.com/media/product/37216_laptop_asus_d509da_ej286t__silver__1_2.jpg",
"https://clapway.com/wp-content/uploads/2017/06/3.-Asus.jpg",
"https://www.zdnet.com/a/hub/i/2021/01/07/a20ae151-6384-47c4-a75e-802455021c41/apple-iphone-12-best-phones-review.png",
"https://images-na.ssl-images-amazon.com/images/I/71i2XhHU3pL._SX679_.jpg",
"https://cellphones.com.vn/sforum/wp-content/uploads/2020/06/Sony-PS5-7.jpg",
"https://blog.fshare.vn/wp-content/uploads/2020/06/49747503557_fa12f113db_h-6.jpg",
]

export default function imageFactory() {
    return img[Math.floor(Math.random() * img.length)];
}