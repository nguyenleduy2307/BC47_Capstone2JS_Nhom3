
// Hàm domID:
function domID(id) {
    return document.querySelector(id)
}

// Get phone list:
function getPhoneList() {
    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones',
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phone = result.data;
            renderUI(phone);
        })

        .catch(function (err) {
            console.log(err)
        })
}

// Hàm render UI:
function renderUI(arr) {
    var HTMLContent = '';
    for (var i = 0; i < arr.length; i++) {
        var phone = arr[i];
        HTMLContent += `<tr>
                    <td class="col-1">${i+1}</td>
                    <td class="col-1">${phone.name}</td>
                    <td class="col-2">
                        ${new Intl.NumberFormat('vn-VN').format(phone.price)} <span>VND</span>
                    </td>
                    <td class="col-1">${phone.screen}</td>
                    <td class="col-2">
                        <img style='max-width: 150px' src="${phone.picture}" alt="Link bị lỗi">
                    </td>
                    <td class="col-2">${phone.desc}</td>
                    <td class="col-1">${phone.type}</td>
                    <td class="col-2">
                        <button 
                            class="btn btn-success"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            onclick="updatePhone(${phone.id})"
                        >
                        Edit
                        </button>

                        <button 
                            class="btn btn-danger"
                            data-toggle="modal"
                            data-target="#modelConfirmDelete"
                            onclick="getIDPhone(${phone.id})"                            
                        >
                        Delete
                        </button>
                    </td>
                </tr>`
    }
    domID('#tbodyFood').innerHTML = HTMLContent;
}

// Gọi hàm getPhoneList ra => để khi web lên, tự động in ra giao diện
getPhoneList()

// Ẩn nút cập nhật và hiện nút thêm khi ấn btnThem:
domID('#btnThem').onclick = function () {
    domID('#btnCapNhat').style.display = 'none';
    domID('#btnThemDT').style.display = 'inline-block';
}

// Lấy thông tin từ user:
function layThongTinPhone() {

    // Lấy từ input:
    var name = domID('#tenDT').value;
    var price = domID('#giaDT').value;
    var screen = domID('#manHinhDT').value;
    var picture = domID('#hinhDT').value;
    var desc = domID('#moTa').value;
    var type = domID('#loaiDT').value;

    // Tạo đối tượng phone từ lớp đối tượng Phone:
    var phone = new Phone(name, price, screen, picture, desc, type);

    // Validation:
    var isValid = true;

    // ---- Kiểm tra name:
    isValid &= kiemTraChieuDaiChuoi(
        phone.name,
        1,
        undefined,
        '#spanTenDT',
        'Tên không được để trống'
    )

    // ---- Kiểm tra giá:
    isValid &= kiemTraChieuDaiChuoi(
        phone.price,
        1,
        undefined,
        '#spanGiaDT',
        'Giá không được để trống'
    ) && kiemTraDinhDangChuoi(
        phone.price,
        /^[0-9]+$/,
        '#spanGiaDT',
        'Giá phải là số'
    ) && kiemTraGiaTriChuoi(
        phone.price,
        2000000,
        50000000,
        '#spanGiaDT',
        'Giá phải từ 2 đến 50 triệu'
    )

    // Kiểm tra màn hình:
    isValid &= kiemTraChieuDaiChuoi(
        phone.screen,
        1,
        undefined,
        '#spanManHinhDT',
        'Màn hình không được để trống'
    )

    // Kiểm tra loại điện thoại:
    isValid &= kiemTraSelect(
        phone.type,
        '#spanLoaiDT',
        'Bạn chưa chọn loại điện thoại'
    )

    // Kiểm tra Link hình ảnh:
    isValid &= kiemTraChieuDaiChuoi(
        phone.picture,
        1,
        undefined,
        '#spanHinhDT',
        'Hình ảnh không được để trống'
    )

    // Kiểm tra mô tả:
    isValid &= kiemTraChieuDaiChuoi(
        phone.desc,
        1,
        undefined,
        '#spanMoTa',
        'Mô tả không được để trống'
    )
    return isValid ? phone : undefined;
    
}

// Thêm điện thoại:
domID('#btnThemDT').onclick = function () {
    // Lấy thông tin từ user:
    var phone = layThongTinPhone();

    if (phone) {
        // Đưa dữ liệu lấy từ input lên server:
        var promise = axios({
            url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones',
            method: 'POST',
            data: phone,
        })
        
        // Thông báo thêm ĐT thành công:
        $('.themThanhCong').toast('show')

        promise
            .then(function () {
                // Gọi lại ra giao diện:
                getPhoneList();

    
                // Đóng model sau khi thêm thành công:
                domID('#btnClose').click();
            })
    
            .catch(function () {
                alert('Tạo thất bại')
            })
    }
}

// Lấy id điện thoại muốn xóa:

var idPhoneDelete = -1;

function getIDPhone(id) {
    idPhoneDelete = id;
}

// Xóa điện thoại:
domID('#btnConfirmDelete').onclick = function () {
    deletePhone(idPhoneDelete)
    // Thông báo thêm ĐT thành công:
    $('.xoaThanhCong').toast('show')
}

function deletePhone(idPhone) {
    var promise = axios({
        url: `https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones/${idPhone}`,
        method: 'DELETE'
    })

    promise
        .then(function () {
            // Gọi lại ra giao diện:
            getPhoneList();
        })

        .catch(function () {
            alert('Xóa thất bại');
        })
}

// Tạo biến lấy id phone update:
var idPhoneUpdate = '';

// Update điện thoại - Show lên UI dữ liệu cần update:
function updatePhone(idPhone) {

    // Hiện nút cập nhật và ẩn nút thêm:
    domID('#btnCapNhat').style.display = 'inline-block';
    domID('#btnThemDT').style.display = 'none';

    // Lấy dữ liệu từ server về đưa lên UI:
    var promise = axios({
        url: `https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones/${idPhone}`,
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phone = result.data;

            // Lấy ID của phone update để sử dụng đưa ngược lại lên server:
            idPhoneUpdate = phone.id;

            // dom và show UI:
            domID('#tenDT').value = phone.name;
            domID('#giaDT').value = phone.price;
            domID('#manHinhDT').value = phone.screen;
            domID('#hinhDT').value = phone.picture;
            domID('#moTa').value = phone.desc;
            domID('#loaiDT').value = phone.type;
        })

        .catch(function () {
            alert('Update thất bại')
        })
}

// Update điện thoại - Chỉnh sửa và cập nhật lại lên server:
domID('#btnCapNhat').onclick = function () {
    // Lấy thông tin sau edit:
    var phoneEdit = layThongTinPhone();

    if (phoneEdit) {
        // Đưa thông tin sau edit lên server:
        var promise = axios({
            url: `https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones/${idPhoneUpdate}`,
            method: 'PUT',
            data: phoneEdit,
        })

        // Thông báo thêm ĐT thành công:
        $('.capNhatThanhCong').toast('show')
    
        promise
            .then(function () {
                getPhoneList()
    
                // Đóng model sau khi update xong:
                domID('#btnClose').click();
            })
    
            .catch(function () {
                alert('Update thất bại')
            })
    }
}

// Reset ô input sau khi đóng:
domID('#btnClose').onclick = function () {
    // Reset input sau khi đóng:
    domID('#phoneForm').reset();

    // Reset validation sau khi đóng:
    domID('#spanTenDT').innerHTML = '';
    domID('#spanGiaDT').innerHTML = '';
    domID('#spanManHinhDT').innerHTML = '';
    domID('#spanLoaiDT').innerHTML = '';
    domID('#spanHinhDT').innerHTML = '';
    domID('#spanMoTa').innerHTML = '';
}

// Tạo hàm tìm điện thoại:
domID('#searchName').addEventListener('keyup', function () {
    var valueSearch = domID('#searchName').value.toLowerCase();
    var arrSearch = [];

    // Lấy dữ liệu từ server về:
    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones/',
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phone = result.data;
            for (var i = 0; i < phone.length; i++) {
                var namePhone = phone[i].name.toLowerCase();
                if (namePhone.indexOf(valueSearch) !== -1) {
                    arrSearch.push(phone[i])
                }
            }
            renderUI(arrSearch);
        })

        .catch(function () {
            alert('Search thất bại')
        })
})

// Sắp xếp theo giá tiền:
domID('#xepLoai').onchange = function () {
    // Lấy dữ liệu từ server về:
    var promise = axios({
        url: 'https://64ad63b6b470006a5ec5e1ae.mockapi.io/phones/',
        method: 'GET'
    })

    promise
        .then(function (result) {
            var phone = result.data;
            var arrSapXep = [];

            if (domID('#xepLoai').value === 'giamDan') {
                arrSapXep = phone.sort(function (a, b) {
                    return b.price - a.price
                })
            
            } else if (domID('#xepLoai').value === 'tangDan') {
                arrSapXep = phone.sort(function (a, b) {
                    return a.price - b.price
                })
              
            } else {
               arrSapXep = phone;
            }

            renderUI(arrSapXep);
        })

        .catch(function () {
            alert('Sắp xếp thất bại')
        })
}



// validation cho link điện thoại
// khi search tên ĐT => filter/ xóa => tự động render lại all UI, muốn chỉ render những cái search đc k

// Làm theo bài QLNV + các lỗi sai mentor comment:
/**
1 số góp ý, check lại nhé:
thêm nhân viên: lần đầu click bấm button thêm sinh viên, sẽ báo lỗi trống 
( khi mình điền dữ liệu ô nào rồi thì nên ẩn cái thông báo error đi luôn,
nếu người dùng nhập sai lỗi khác thì hiển thị thông báo lỗi khác luôn ko 
nên đợi tới khi bấm submit mới hiển thị lỗi, giống kiểu focus )
Chức năng search nên search thêm cả không dấu nữa nhé 
(ví dụ: nhập: (xuat sac, xuatsac, XuatSac, Xuat Sac, XUATSAC, )
thì cũng search được kết quả nếu có nhân viên xuất sắc)
Chức năng cập nhật nhân viên không hoạt động
Khi xoá nhân viên thì nên có 1 modal confirm để không may xoá nhầm còn quay lại được
 */
