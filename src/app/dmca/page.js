// src/app/dmca/page.js
import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: 'Chính sách Bản quyền (DMCA) | baihat-hopam.vn',
  description: 'Chính sách về bản quyền và hướng dẫn báo cáo vi phạm tại baihat-hopam.vn.',
};

export default function DmcaPage() {
  return (
    <StaticPageLayout title="Chính sách Bản quyền & Báo cáo Vi phạm (DMCA)">
      <h2>1. Tôn trọng Bản quyền</h2>
      <p>
        <strong>baihat-hopam.vn</strong> được xây dựng với mục đích phục vụ học tập, nghiên cứu và giải trí phi thương mại. Chúng tôi tôn trọng quyền sở hữu trí tuệ của các tác giả, nhạc sĩ và các bên liên quan.
      </p>
      <p>
        Phần lớn nội dung hợp âm trên trang web được đóng góp bởi cộng đồng người dùng. Mặc dù chúng tôi luôn nỗ lực kiểm duyệt, không thể tránh khỏi những sai sót. Chúng tôi hoạt động tuân thủ theo Đạo luật Bản quyền Thiên niên kỷ Kỹ thuật số (DMCA).
      </p>

      <h2>2. Quy trình Báo cáo Vi phạm Bản quyền</h2>
      <p>
        Nếu bạn là chủ sở hữu bản quyền hoặc người đại diện được ủy quyền và tin rằng bất kỳ nội dung nào trên trang web của chúng tôi vi phạm bản quyền của bạn, vui lòng gửi cho chúng tôi một thông báo ("Thông báo Gỡ bỏ") qua email: 
        <strong><a href="mailto:dmca@baihat-hopam.vn">dmca@baihat-hopam.vn</a></strong>.
      </p>
      <p>
        Thông báo của bạn phải bao gồm các thông tin sau:
      </p>
      <ul>
        <li>Chữ ký điện tử hoặc vật lý của người được ủy quyền hành động thay mặt cho chủ sở hữu bản quyền.</li>
        <li>Mô tả về tác phẩm có bản quyền mà bạn cho là đã bị vi phạm.</li>
        <li>Đường dẫn (URL) cụ thể đến nội dung vi phạm trên <strong>baihat-hopam.vn</strong>.</li>
        <li>Thông tin liên hệ của bạn, bao gồm địa chỉ, số điện thoại và địa chỉ email.</li>
        <li>Một tuyên bố rằng bạn tin tưởng một cách thiện chí rằng việc sử dụng nội dung đó không được chủ sở hữu bản quyền, người đại diện hoặc pháp luật cho phép.</li>
        <li>Một tuyên bố, được đưa ra dưới hình phạt khai man, rằng thông tin trong thông báo của bạn là chính xác và bạn là chủ sở hữu bản quyền hoặc được ủy quyền hành động thay mặt chủ sở hữu.</li>
      </ul>

      <h2>3. Hành động của chúng tôi</h2>
      <p>
        Sau khi nhận được Thông báo Gỡ bỏ hợp lệ, chúng tôi sẽ nhanh chóng điều tra và gỡ bỏ hoặc vô hiệu hóa quyền truy cập vào nội dung bị cho là vi phạm. Chúng tôi cũng sẽ thông báo cho người dùng đã đăng tải nội dung đó về hành động của chúng tôi.
      </p>
    </StaticPageLayout>
  );
}