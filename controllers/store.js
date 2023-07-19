
// Hàm domID:
function domID(id) {
    return document.querySelector(id);
}

// Hàm lấy thông tin Phone từ server:
function getPhoneList() {
    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones',
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phone = result.data;
            renderUI(phone)
        })
        .catch(function (err) {
            console.log(err)
        })
}

// Hàm renderUI:
function renderUI(arr) {
    var htmlContent = '';
    for (var i = 0; i < arr.length; i++) {
        var phone = arr[i];
        htmlContent +=
            `<div class="col-12 col-md-6 col-lg-4">
            <div class="card cardPhone">
                <img src="${phone.picture}" class="card-img-top" alt="Hình lỗi">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <h3 class="cardPhone__title">${phone.name}</h3>
                            <span class="cardPhone__text font-weight-bold rounded p-1" style="background-color: gainsboro; color: black;">${phone.type}</span>
                        </div>
                        <div>
                            <h3 class="cardPhone__title">${new Intl.NumberFormat('vn-VN').format(phone.price)}</h3>
                            <p class="cardPhone__text"><span class="font-weight-bold">Màn hình: </span>${phone.screen}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="cardPhone__text"><span class="font-weight-bold">Mô tả: </span>${phone.desc}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="cardPhone__rating">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </div>
                        <div>
                            <button 
                                class="btnPhone-shadow"
                                onclick = "themGioHang(${phone.id})"
                            >
                                <i class="fa fa-shopping-cart"></i>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div> `
    }
    domID('#htmlProduct').innerHTML = htmlContent;
}

// Gọi hàm getPhoneList => khi web mở lên, tự động in ra giao diện
getPhoneList()

// Dropdown_Filter type điện thoại:
domID('#filterProduct').onchange = function () {

    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones',
        method: 'GET'
    })

    promise
        .then(function (result) {

            var phone = result.data;
            var arrFilter = [];

            if (domID('#filterProduct').value === 'Apple') {
                arrFilter = phone.filter(value => value.type === 'Apple');
            } else if (domID('#filterProduct').value === 'Samsung') {
                arrFilter = phone.filter(value => value.type === 'Samsung');
            } else {
                arrFilter = phone;
            }

            renderUI(arrFilter);
        })
}


// Tạo mảng giỏ hàng:
var arrCart = []

// In ra giỏ hàng từ dữ liệu lấy từ LocalStorage:
getLocalStorage()


// Tạo hàm lấy sản phẩm đưa vào giỏ hàng:
function themGioHang(id) {

    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones',
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phoneCart = result.data;

            // Duyệt mảng phoneCart lấy từ server:
            for (var i = 0; i < phoneCart.length; i++) {
                var idPhone = Number(phoneCart[i].id);
                if (idPhone === id) {

                    // Tạo đối tượng cartObj, nếu chọn mua ĐT nào thì tạo ra đối tượng cho ĐT đó:
                    var cartObj = {
                        id: phoneCart[i].id,
                        picture: phoneCart[i].picture,
                        name: phoneCart[i].name,
                        type: phoneCart[i].type,
                        price: phoneCart[i].price,
                        screen: phoneCart[i].screen,
                        desc: phoneCart[i].desc,
                        quantity: 1,
                    }

                    var idPhone3 = Number(cartObj.id);
                    var isId = true;

                    // Kiểm tra mảng giỏ hàng đã có ĐT đó chưa:
                    for (var j = 0; j < arrCart.length; j++) {

                        var idPhone2 = Number(arrCart[j].id);

                        if (idPhone2 === idPhone3) {
                            isId = false;
                            break;
                        }
                    }

                    // Nếu chưa có thì thì push vào đối tượng mới, chưa có thì quantity tăng lên 1: 
                    if (isId) {
                        arrCart.push(cartObj)
                    } else {
                        arrCart[j].quantity += 1;
                    }
                }
            }

            // Render UI giỏ hàng:
            renderGioHang(arrCart);

            setLocalStorage();
        })
        .catch(function (err) {
            console.log("err: ", err);
        })
}


// Render giỏ hàng:
function renderGioHang(arr) {
    var htmlContentGioHang = '';
    for (var i = 0; i < arr.length; i++) {
        var phone = arr[i];
        htmlContentGioHang += `<div class="card mb-3 border-1 p-2" style="max-width: 600px;">
        <div class="row no-gutters">
            <div class="col-md-4">
                <img style="max-width: 150px"
                    src="${phone.picture}"
                    alt="Hình lỗi">
            </div>
            <div class="col-md-6">
                <div class="card-body p-0">
                    <h5 class="font-weight-bold">${phone.name}</h5>
                    <h5 class="font-weight-bold mb-3">${new Intl.NumberFormat('vn-VN').format(phone.price)}</h5>
                    <p class="mb-2"><span class="font-weight-bold rounded p-1"
                            style="background-color: gainsboro">${phone.type}</span></p>
                    <p class="mb-1"><span class="font-weight-bold">Màn hình: </span>${phone.screen}</p>
                    <p class="mb-1"><span class="font-weight-bold">Mô tả: </span>${phone.desc}</p>
                </div>
            </div>
            <div class="col-md-2">
                <button class="btnDeleteItem border-0 p-2 rounded bg-white"
                    style="font-size: 16px;"
                    data-toggle="modal"
                    data-target="#ConfirmDeleteCartItem"
                    onclick = "getIDPhone(${phone.id})"
                    >
                    <span>
                        <i class="fas fa-trash-alt"></i>
                    </span>
                </button>
            </div>
        </div>
        <div class="modal-body d-flex justify-content-between pb-0">
            <div>
                <h5 class="cardPhone__title text-success" style="font-size: 16px;">Số lượng: 
                    <button
                        class="btn btn-outline-success ml-3"
                        onclick="giamSoLuongGioHang(${phone.id})"
                    >
                    -
                    </button>

                    <span class="px-2">${phone.quantity}</span>

                    <button 
                        class="btn btn-outline-success"
                        onclick="tangSoLuongGioHang(${phone.id})"
                    >
                    +
                    </button>                                  
                </h5>
            </div>
            <div class="text-right">
                <h5 class="cardPhone__title mb-0">${new Intl.NumberFormat('vn-VN').format(phone.quantity * phone.price)}</h5>
            </div>
        </div>
    </div>`
    }

    // In giao diện sản phẩm:
    domID('#itemCart').innerHTML = htmlContentGioHang;

    // Tính tiền:
    domID('#tamTinh').innerHTML = new Intl.NumberFormat('vn-VN').format(tinhTienTamTinh());
    domID('#phiVanChuyen').innerHTML = new Intl.NumberFormat('vn-VN').format(tinhTienGiaoHang());
    domID('#tongTien').innerHTML = new Intl.NumberFormat('vn-VN').format(tinhTienTongTien(tinhTienTamTinh(), tinhTienGiaoHang()));

    // Tổng số lượng trong giỏ hàng
    domID('#qtyCart').innerHTML = tinhTongSoLuongGH();
}

// Hàm giảm số lượng sản phẩm trong giỏ hàng:
function giamSoLuongGioHang(idPhone) {
    for (var k = 0; k < arrCart.length; k++) {
        if (Number((arrCart[k]).id) === (Number(idPhone))) {
            arrCart[k].quantity -= 1;
            if (arrCart[k].quantity < 1) {
                arrCart.splice(k,1)
            }
            setLocalStorage();
        }
    }
    renderGioHang(arrCart);
}

// Hàm tăng số lượng sản phẩm trong giỏ hàng:
function tangSoLuongGioHang(idPhone) {
    for (var k = 0; k < arrCart.length; k++) {
        if (Number((arrCart[k]).id) === (Number(idPhone))) {
            arrCart[k].quantity += 1;
            setLocalStorage();
        }
    }
    renderGioHang(arrCart);
}

// Hàm tính tiền TẠM TÍNH:
function tinhTienTamTinh() {
    var tamTinh = 0;
    for (var k = 0; k < arrCart.length; k++) {
        tamTinh += (arrCart[k].quantity) * (arrCart[k].price);
    }
    return tamTinh;
}

// Hàm tính tiền VẬN CHUYỂN:
function tinhTienGiaoHang() {
    var phiGiaoHang = 0;
    var qty = 0;
    for (var k = 0; k < arrCart.length; k++) {
        qty += arrCart[k].quantity
    }
    phiGiaoHang = qty * 50000
    return phiGiaoHang;
}

// Hàm tính tiền TỔNG TIỀN:
function tinhTienTongTien(a, b) {
    return a + b;
}

// Hàm tính tổng số lượng trong giỏ hàng:
function tinhTongSoLuongGH() {
    var qty = 0;
    for (var k = 0; k < arrCart.length; k++) {
        qty += arrCart[k].quantity;
    }
    return qty;
}

// Lưu giỏ hàng vào localStorage:
function setLocalStorage () {
    localStorage.setItem('arrCart', JSON.stringify(arrCart));
}

// Lấy data từ localStorage lên giao diện:
function getLocalStorage () {
    var data = localStorage.getItem('arrCart');

    if (data) {
        // Chuyển JSON về Array:
        arrCart = JSON.parse(data);
    }
    renderGioHang(arrCart);
}


// Thông báo trước khi xóa toàn bộ giỏ hàng:
domID('#btnXoa').onclick = function () {
    if (arrCart.length) {
        domID('#innerHTMLDeleteAll').innerHTML = 'Bạn muốn xóa tất cả sản phẩm ?'
        domID('#btnConfirmNo').style.display = 'inline-block';
        domID('#btnDeleteAll').style.display = 'inline-block';
    } else {
        domID('#innerHTMLDeleteAll').innerHTML = 'Giỏ hàng hiện đang trống'
        domID('#btnConfirmNo').style.display = 'none';
        domID('#btnDeleteAll').style.display = 'none';
    }
}

// Hàm xóa giỏ hàng (Xóa toàn bộ):
domID('#btnDeleteAll').onclick = function () {
    arrCart = [];
    renderGioHang(arrCart)
    setLocalStorage();
}

// Lấy id điện thoại muốn xóa:
var idPhoneDelete = -1;
function getIDPhone(id) {
    idPhoneDelete = id;
}

// Hàm xóa giỏ hàng (Xóa từng điện thoại):
domID('#btnDeleteCartItem').onclick = function () {
    deleteCartItem(idPhoneDelete);
    setLocalStorage();
}

// Hàm xóa:
function deleteCartItem(id2) {
    var index = -1;
    for (i = 0; i < arrCart.length; i++) {
        var idPhone = Number(arrCart[i].id);
        if (idPhone === Number(id2)) {
            index = i;
        }
    }
    arrCart.splice(index, 1)
    renderGioHang(arrCart)
}


// Thanh toán giỏ hàng:
domID('#btnThanhToan').onclick = function () {
    if (arrCart.length) {
        arrCart = [];
        renderGioHang(arrCart);
        domID('#innerThanhToanTC').innerHTML = `<span class="text-success font-weight-bold" style="font-size: 24px"><i
                    class="far fa-check-circle text-center"></i></span>
            <span style="font-size: 16px;">Thanh toán thành công <br> Đơn hàng sẽ được giao đến địa chỉ của
                    bạn</span>`
        $('.thanhToanThanhCong').toast('show');

    } else {
        domID('#innerThanhToanTC').innerHTML = 'Giỏ hàng hiện đang trống';
        $('.thanhToanThanhCong').toast('show');
    }
    setLocalStorage();
}