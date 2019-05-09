const moduleShop = (() => {
    const productsContainer = document.querySelector('#productsContainer')
    const cartContainer = document.querySelector('#cartContainer')
    const productsToCart = []


    const renderProducts = () => {
        fetch('http://rollshop/postdata.php')
        .then(data => {
            return data.json()
        }).then(products => {
            productsContainer.innerHTML = ''
            for(let index in products) {
                const markup = `<div class="col-md-6" data-id="${products[index].id}">
                                <div class="card mb-4">
                                    <img class="product-img" src="${products[index].img_path}" alt="${products[index].productName}">
                                    <div class="card-body text-center">
                                        <h4 class="item-title">${products[index].product_name}</h5>
                                        <p><small class="text-muted">${products[index].quantity} шт.</small></p>

                                        <div class="details-wrapper">
                                            <div class="items">
                                                <div class="items__control" data-click="minus">-</div>
                                                <div class="items__current" data-count=${products[index].id}>1</div>
                                                <div class="items__control" data-click="plus">+</div>
                                            </div>

                                            <div class="price">
                                                <div class="price__weight">${products[index].weight}г.</div>
                                                <div class="price__currency" data-priceId="${products[index].id}">${products[index].price} ₽</div>
                                            </div>
                                        </div>
                                        <button type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>
                                    </div>
                                </div>
                            </div>`
                productsContainer.insertAdjacentHTML('beforeend', markup)
            }
        })
    }

    const get = (url) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open('GET', url, true);
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    resolve(request.response)
                } else {
                    const error = new Error(request.statusText)
                    error.code = request.status
                    reject(new Error(error))
                }
            })
            
            request.addEventListener('error', () => {
                reject(new Error('Network error'))
            })

            request.send()
        })
    }

    const calculatePrice = (id, quantity) => {
        get(`http://rollshop/get.php?id=${encodeURIComponent(id)}`).then(product => {
            const productInfo = JSON.parse(product)
            if (productInfo.id == id) {
                const currentPrice = parseInt(productInfo.price)
                let totalPrice = currentPrice * quantity
                
                document.querySelector(`[data-priceId="${id}"]`).innerText = `${totalPrice} ₽`
            }
        })
    }

    const counter = (id, type) => {
        let count = parseInt(document.querySelector(`[data-count="${id}"]`).innerText)
        if (type === 'minus') {
            if (count > 1) {
                count--
                calculatePrice(id, count)
                document.querySelector(`[data-count="${id}"]`).innerText = count
            }
        } else if (type === 'plus') {
            count++
            calculatePrice(id, count)
            document.querySelector(`[data-count="${id}"]`).innerText = count
        }
    }

    const renderBasket = () => {
        if (document.cookie != '' && document.cookie.split('=')[1] != 'empty') { 
            const basket = JSON.parse(document.cookie.split('=')[1])
            cartContainer.innerHTML = ''
            let totalCost = 0
            if (basket !== null) {
                basket.forEach(productBasket => {
                    const markup = `<div class="cart-item" data-cartproductid="${productBasket.id}">
                                    <div class="cart-item__top">
                                        <div class="cart-item__img">
                                            <img src="${productBasket.img_path}" alt="${productBasket.productName}">
                                        </div>
                                        <div class="cart-item__desc">
                                            <div class="cart-item__title">${productBasket.productName}</div>
                                            <div class="cart-item__weight">1 шт. / ${productBasket.weight}г.</div>
                                            <div class="cart-item__details">
                                                <div class="items items--small">
                                                    <div class="items__control" data-click="minus">-</div>
                                                    <div class="items__current" data-count="${productBasket.id}">${productBasket.amount}</div>
                                                    <div class="items__control" data-click="plus">+</div>
                                                </div>
                                                <div class="price">
                                                    <div class="price__currency" data-priceId="${productBasket.id}">${productBasket.price} ₽</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                    totalCost += productBasket.price
                    cartContainer.insertAdjacentHTML('beforeend', markup)
                })
            }

            document.querySelector('.total-price').innerText = totalCost
            
            if (basket == 'empty') {
                document.querySelector('.alert').classList.remove('show')
                document.querySelector('.alert').classList.add('hide')

                document.querySelector('.cart-wrapper').classList.remove('hide')
                document.querySelector('.cart-wrapper').classList.add('show')
            } else {
                document.querySelector('.alert').classList.remove('show')
                document.querySelector('.alert').classList.add('hide')
                document.querySelector('.cart-wrapper').classList.remove('hide')
                document.querySelector('.cart-wrapper').classList.add('show')
            }
        }
    }

    const writeCookie = (data, days=30) => {
        const expire = new Date()
        expire.setHours(expire.getHours() + 24 * days)
        document.cookie = `cart=${JSON.stringify(data)};expires=${expire};path=/`
    }

    const calculateTotalPrice = (productsArray) => {
        let commonCost = 0
        productsArray.forEach(product => {
            commonCost += product.price
        })

        if (commonCost >= 1000) {
            document.querySelector('.delivery').classList.remove('hide')
            document.querySelector('.delivery').classList.add('show')
        } else {
            document.querySelector('.delivery').classList.remove('show')
            document.querySelector('.delivery').classList.add('hide')
        }

        document.querySelector('.total-price').innerText = commonCost
    }

    const addToCard = id => {
        get(`http://rollshop/get.php?id=${encodeURIComponent(id)}`)
        .then(response => {
            return JSON.parse(response)
        }).then(product => {
            const productToCart = {
                id: product.id,
                img_path: product.img_path,
                product_name: product.product_name,
                weight: product.weight,
                costPerUnit: product.price,
                amount: parseInt(document.querySelector(`[data-count="${id}"]`).innerText),
                price: parseInt(document.querySelector(`[data-priceId="${id}"]`).innerText)
            }

            productsToCart.push(productToCart)

            const filteredProducts = {}
            productsToCart.forEach(element => {
                filteredProducts[element.id] = {
                    id: element.id,
                    img_path: element.img_path, 
                    productName: element.product_name,
                    weight: element.weight,
                    costPerUnit: element.costPerUnit,
                    amount: element.amount,
                    price: element.price,
                }
                
            })

            const readyProductsToCart = Object.keys(filteredProducts).map(key => filteredProducts[key])
            calculateTotalPrice(readyProductsToCart)
            writeCookie(readyProductsToCart)

            if (document.cookie != '')
                renderBasket()
            
            renderProducts()
        })
    }

    const changeProductBasket = (id, type) => {
        const productsBasket = JSON.parse(document.cookie.split('=')[1])
        const index = productsBasket.findIndex(product => {
            if (product.id == id)
                return true
        })

        if (type == 'minus') {
            if(productsBasket[index].amount > 1)
            productsBasket[index].amount--
            productsBasket[index].price = productsBasket[index].amount * productsBasket[index].costPerUnit
        } else if (type == 'plus') {
            productsBasket[index].amount++
            productsBasket[index].price = productsBasket[index].amount * productsBasket[index].costPerUnit
        }

        calculateTotalPrice(productsBasket)
        writeCookie(productsBasket)
        renderBasket()
    }

    const createNotify = (notifyBox, notifyElem, notifyClass, notifyText, notifyPosition) => {
        const errorItem = document.createElement(notifyElem)
        errorItem.classList.add(notifyClass)
        errorItem.innerText = notifyText
        notifyBox.append(errorItem)
        document.querySelector(notifyPosition).appendChild(notifyBox)
    }

    const checkNotify = (notifyClass, boxClass) => {
        const childrenFormGroup = document.querySelector(boxClass).children
        for (let elem of childrenFormGroup) {
            if (elem.matches(notifyClass)) {
                elem.remove()
            }
        }
    }

    const checkForm = (nameValue, phoneValue) => {
        const errors = document.createElement('div')
        errors.classList.add('error')
        const errorsText = {}

        checkNotify('.error', '.form-group')
    
        const checkPhone = /7-\d{3}-\d{3}-\d{2}-\d{2}/
        let formChecked = false

        if (nameValue == '' && phoneValue == '') {
            errorsText.emptyName = 'Введите имя'
            errorsText.emptyPhone = 'Введите телефон'
            for (const index in errorsText) {
                createNotify(errors, 'p', 'error__item', errorsText[index], '.form-group')
            }
        } else {
            if (!checkPhone.test(phoneValue)) {
                errorsText.wrongFormatPhone = 'Неверный формат телефона. Телефон должен быть в следующем формате: 7-XXX-XXX-XX-XX'
                createNotify(errors, 'p', 'error__item', errorsText.wrongFormatPhone, '.form-group')
            } else {
                formChecked = true
            }
        }
        return formChecked
    }


    const createOrder = (name, phone) => {
        const readyOrder = {
            name,
            phone,
            totalCost: parseInt(document.querySelector('.total-price').innerText)
        }

        fetch('http://rollshop/order.php', {
            method: document.forms.order.getAttribute('method'),
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: JSON.stringify(readyOrder)
        }).then(responce => {
            if (responce.status < 300) {
                document.getElementById('name').value = null
                document.getElementById('phone').value = null
                document.cookie = `cart=empty;expires=${new Date().getHours() - 1}`

                const success = document.createElement('div')
                success.classList.add('success')

                checkNotify('.success','#basket-card')
                createNotify(success, 'p', 'success__item', 'Заказ успешно оформлен!', '#basket-card')
                setTimeout(() => {
                    document.querySelector('.success').classList.add('hide')
                }, 2000)

                document.querySelector('.alert').classList.remove('hide')
                document.querySelector('.alert').classList.add('show')
                document.querySelector('.cart-wrapper').classList.remove('show')
                document.querySelector('.cart-wrapper').classList.add('hide')
            }
        }).catch(error => {
            console.log(new Error('Network error'))
        })
    }

    productsContainer.addEventListener('click', event => {
        let id = event.target.closest('[data-id]').dataset.id;
        if (event.target.matches('[data-click="minus"]')) {
            counter(id, 'minus')
        } else if (event.target.matches('[data-click="plus"]')) {
            counter(id, 'plus')
        } else if(event.target.matches('.btn')) {
            addToCard(id)
        }
    })

    cartContainer.addEventListener('click', event => {
        let id = event.target.closest('[data-cartproductid]').dataset.cartproductid
        
        if (event.target.matches('[data-click="minus"]')) {
            changeProductBasket(id, 'minus')
        } else if (event.target.matches('[data-click="plus"]')){
            changeProductBasket(id, 'plus')
        }
    })

    document.forms.order.addEventListener('submit', event => {
        event.preventDefault()
        const phoneValue = document.getElementById('phone').value
        const nameValue = document.getElementById('name').value
        if (checkForm(nameValue, phoneValue))
            createOrder(nameValue, phoneValue)
    })


    return {
        renderProducts,
        renderBasket
    }
})()

moduleShop.renderProducts()
if (document.cookie != '') {
    moduleShop.renderBasket()
}
