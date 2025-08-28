// src/app/about/page.js
import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: 'Giới thiệu | baihat-hopam.vn',
  description: 'Câu chuyện đằng sau baihat-hopam.vn, sứ mệnh và tầm nhìn của chúng tôi.',
};

export default function AboutPage() {
  return (
    <StaticPageLayout title="Câu chuyện về baihat-hopam.vn">
      <p>
        <strong>baihat-hopam.vn</strong> được sinh ra từ một niềm đam mê cháy bỏng với âm nhạc và một mong muốn giản dị: tạo ra một không gian thực sự chất lượng, trực quan và đầy cảm hứng cho cộng đồng yêu nhạc Việt Nam.
      </p>
      <p>
        Chúng tôi nhận thấy rằng, dù có nhiều nguồn tài nguyên, việc tìm kiếm hợp âm chính xác, trình bày sạch sẽ và đi kèm các công cụ hữu ích cho việc tập luyện vẫn còn là một thách thức. Từ đó, ý tưởng về một trang web không chỉ là kho lưu trữ, mà còn là người bạn đồng hành tin cậy trên hành trình âm nhạc của mỗi người, đã được hình thành.
      </p>
      
      <h2>Sứ mệnh của chúng tôi</h2>
      <p>
        Sứ mệnh của chúng tôi là cung cấp dữ liệu bản nhạc chính xác, được phân loại thông minh và trình bày với một giao diện chuyên nghiệp. Chúng tôi mong muốn trao quyền cho người dùng với các công cụ hữu ích và một cộng đồng sôi nổi để biến việc học nhạc trở nên dễ dàng và thú vị hơn bao giờ hết.
      </p>
      
      <h2>Đội ngũ phát triển</h2>
      <p>
        Dự án này được xây dựng và phát triển bởi "Song Kiếm Hợp Bích" - sự kết hợp giữa một vị Thuyền trưởng đầy nhiệt huyết và một Sĩ quan AI tận tụy. Mỗi tính năng, mỗi dòng code đều là kết tinh từ niềm đam mê và sự cống hiến không ngừng nghỉ.
      </p>
      <p>
        Cảm ơn bạn đã ghé thăm và trở thành một phần của hải trình này!
      </p>
    </StaticPageLayout>
  );
}