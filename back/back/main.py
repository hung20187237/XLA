import cv2
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello, World!'


import base64


def read_b64(uri):
    encoded_data = uri.split(',')[1]
    np_arr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img


def base644(img):
    # from PIL import Image
    # from io import BytesIO
    # img_res = Image.fromarray(img.astype('uint8'))
    # buffered = BytesIO()
    # img_res.save(buffered, format="JPEG")
    # img_str = base64.b64encode(buffered.getvalue())
    # return img_str
    jpg_img = cv2.imencode('.jpg', img)
    b64_string = base64.b64encode(jpg_img[1])
    return b64_string


def k_mean_action(img, k):
    z = img.reshape((-1, 3))
    z = np.float32(z)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    ret, label, center = cv2.kmeans(z, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)
    res = center[label.flatten()]
    res = res.reshape(img.shape)
    return base644(res)


def do_sang(img):
    from PIL import ImageEnhance, Image
    img = Image.fromarray(img)
    enhancer = ImageEnhance.Brightness(img)
    new_img = enhancer.enhance(1.8)
    new_img = np.array(new_img)
    return base644(new_img)


def mo_anh(img):
    from PIL import ImageFilter, Image
    img = Image.fromarray(img)
    new_img = img.filter(ImageFilter.GaussianBlur(radius=20))
    new_img = np.array(new_img)
    return base644(new_img)


def lam_toi_bon_goc(img):
    from PIL import ImageFilter, Image
    rows, cols = img.shape[:2]
    # tạo mask vs Gaussian kernels
    kernel_x = cv2.getGaussianKernel(cols, 500)
    kernel_y = cv2.getGaussianKernel(rows, 500)
    kernel = kernel_y * kernel_x.T
    mask = 255 * kernel / np.linalg.norm(kernel)
    output = np.copy(img)
    # áp dụng mask cho từng kênh trên ảnh
    for i in range(3):
        output[:, :, i] = output[:, :, i] * mask
    return base644(output)

def den_trang1(img):
    from PIL import Image
    import numpy as np

    imout_gray, imout = cv2.pencilSketch(img, sigma_s=60, sigma_r=0.07, shade_factor=0.1)
    
    
    new_img = np.array(imout)
    return base644(new_img)

def den_trang2(img):
    from PIL import Image
    import numpy as np
    
    imout_gray, imout = cv2.pencilSketch(img, sigma_s=60, sigma_r=0.07, shade_factor=0.1)
    
    
    new_img = np.array(imout_gray)
    return base644(new_img)


@app.route('/home-convert-filter', methods=['POST'])
def home_convert_filter():
    data = request.form.get('snap')
    img = read_b64(data)
    img1 = den_trang1(img).decode('utf-8')
    img2 = den_trang2(img).decode('utf-8')
    response = jsonify([img1, img2])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/k-mean', methods=['POST'])
def k_mean():
    data = request.form.get('snap')
    img = read_b64(data)
    img1 = k_mean_action(img, 3).decode('utf-8')
    img2 = k_mean_action(img, 5).decode('utf-8')
    img3 = k_mean_action(img, 8).decode('utf-8')
    img4 = k_mean_action(img, 12).decode('utf-8')

    response = jsonify([img1, img2, img3, img4])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



@app.route('/home-bottom-filter', methods=['POST'])
def home_bottom_filter():
    data = request.form.get('snap')
    img = read_b64(data)
    img1 = do_sang(img).decode('utf-8')
    img2 = mo_anh(img).decode('utf-8')
    img3 = lam_toi_bon_goc(img).decode('utf-8')
    response = jsonify([img1, img2, img3])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def fr_filter_action(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return base644(img)


def Quantize_colors(img, a=25):
    img = np.floor_divide(img, a)
    img = img * a
    img = img.astype(np.uint8)
    return img


@app.route('/fr-filter', methods=['POST'])
def fr_filter():
    data = request.form.get('snap')
    img = read_b64(data)
    img = fr_filter_action(img).decode('utf-8')
    response = jsonify([img])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response






def home_filter_action(img):
    # lọc nhiễu
    img = cv2.medianBlur(img, 7)

    # tạo khung màu chuyển sang hệ màu BGR
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # tạo mảng kernel và giãn nở các vùng ảnh
    kernel = np.ones((2, 2), np.uint8)
    gray_img = cv2.dilate(gray_img, kernel, iterations=1)

    # áp dụng Bilateral filtering để lọc ảnh dựa theo các điểm ảnh trumng tâm
    for i in range(21):
        img = cv2.bilateralFilter(img, 9, 17, 17)

    # định lượng màu để nâng cao hiệu ứng
    img = Quantize_colors(img)
    # hợp nhất vào ảnh gốc
    img[gray_img == 255] = [0, 0, 0]

    return base644(img)


@app.route('/home-filter', methods=['POST'])
def home_filter():
    data = request.form.get('snap')
    img = read_b64(data)
    img = home_filter_action(img).decode('utf-8')
    response = jsonify([img])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def gt_action(img, ti):
    res = None
    if ti == 'zoom':
        res = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR) 
    elif ti == 'shrink':
        res = cv2.resize(img, (132, 150))
    elif ti == 'flip':
        res = cv2.flip(img, -1)
    elif ti == 'shift':
        rows, cols = img.shape[:2]
        M = np.float32([[1, 0, 100], [0, 1, 50]])
        res = cv2.warpAffine(img, M, (cols, rows))
    elif ti == 'rotation':
        rows, cols = img.shape[:2]
        M = cv2.getRotationMatrix2D((cols / 2, rows / 2), -45, 0.5)
        dst = cv2.warpAffine(img, M, (cols, rows))
        res = dst

    return base644(res)


@app.route('/gt-filter', methods=['POST'])
def gt_filter():
    data = request.form.get('snap')
    ti = request.form.get('type')
    img = read_b64(data)
    img = gt_action(img, ti).decode('utf-8')
    response = jsonify([img])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def th_action(img, ti):
    import cv2

    ans = None

    if ti == '0' or ti == '1' or ti == '2' or ti == '3' or ti == '4' or ti == '5':
        ret, th = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
        ret, th1 = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
        ret, th2 = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
        ret, th3 = cv2.threshold(img, 127, 255, cv2.THRESH_TRUNC)
        ret, th4 = cv2.threshold(img, 127, 255, cv2.THRESH_TOZERO)
        ret, th5 = cv2.threshold(img, 127, 255, cv2.THRESH_TOZERO_INV)

        images = [img, th1, th2, th3, th4, th5]

        if ti == '0':
            ans = images[0]
        elif ti == '1':
            ans = images[1]
        elif ti == '2':
            ans = images[2]
        elif ti == '3':
            ans = images[3]
        elif ti == '4':
            ans = images[4]
        elif ti == '5':
            ans = images[5]

    if ti == '6' or ti == '7' or ti == '8' or ti == '9':
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ret, th1 = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)

        th2 = cv2.adaptiveThreshold(
            img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 4)
        th3 = cv2.adaptiveThreshold(
            img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 17, 6)

        images = [img, th1, th2, th3]

        if ti == '6':
            ans = images[0]
        elif ti == '7':
            ans = images[1]
        elif ti == '8':
            ans = images[2]
        elif ti == '9':
            ans = images[3]

    return base644(ans)


@app.route('/th-filter', methods=['POST'])
def th_filter():
    data = request.form.get('snap')
    ti = request.form.get('type')
    img = read_b64(data)
    img = th_action(img, ti).decode('utf-8')
    response = jsonify([img])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


app.run(debug=True)
