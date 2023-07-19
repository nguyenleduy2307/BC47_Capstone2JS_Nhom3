
// Hàm kiểm tra chiều dài chuỗi:
function kiemTraChieuDaiChuoi (value, minLength, maxLength, selector, messErr) {
    if (value.trim().length < minLength || value.trim().length > Number(maxLength)) {
        domID(selector).innerHTML = messErr;
        return false;
    } else {
        domID(selector).innerHTML = '';
        return true;
    }
}

// Hàm kiểm tra giá trị chuỗi:
function kiemTraGiaTriChuoi (value, min, max, selector, messErr) {
    if (Number(value) < min || Number(value) > max) {
        domID(selector).innerHTML = messErr;
        return false;
    } else {
        domID(selector).innerHTML = '';
        return true;
    }

}

// Hàm kiểm tra chuỗi ký tự:
function kiemTraDinhDangChuoi (value, pattern, selector, messErr) {
    if (!pattern.test(value)) {
        domID(selector).innerHTML = messErr;
        return false;
    } else {
        domID(selector).innerHTML = '';
        return true;
    }
}

// Hàm kiểm tra loại điện thoại (đã chọn select chưa ?)
function kiemTraSelect (value, selector, messErr) {
    if (value === '') {
        domID(selector).innerHTML = messErr;
        return false;
    } else {
        domID(selector).innerHTML = '';
        return true;
    }
}