import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 | LogocraftAI',
  description: 'LogocraftAI的隐私政策，了解我们如何收集、使用和保护您的数据。',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">隐私政策</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            了解LogocraftAI如何收集、使用和保护您的个人信息
          </p>
          <p className="text-gray-500 mt-4">最后更新: 2023年10月15日</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>简介</h2>
          <p>
            LogocraftAI（"我们"、"我们的"或"本公司"）尊重您的隐私，并致力于保护您的个人数据。本隐私政策将告诉您我们在您使用我们的网站和服务时如何处理您的个人信息，以及您的隐私权和法律保护。
          </p>
          <p>
            我们建议您完整阅读本政策，以充分了解我们如何使用您的数据。如果您不同意本隐私政策，请勿使用我们的服务。
          </p>

          <h2>我们收集的信息</h2>
          <p>
            我们可能收集、使用、存储和传输您的不同类型的个人数据，包括：
          </p>
          <ul>
            <li><strong>身份信息</strong>：包括姓名、用户名或类似标识符。</li>
            <li><strong>联系信息</strong>：包括电子邮件地址和电话号码。</li>
            <li><strong>技术信息</strong>：包括IP地址、登录数据、浏览器类型和版本、设备信息。</li>
            <li><strong>使用数据</strong>：有关您如何使用我们的网站和服务的信息。</li>
            <li><strong>营销和通信数据</strong>：您对接收我们营销信息的偏好。</li>
          </ul>

          <h2>我们如何收集您的个人数据</h2>
          <p>
            我们通过以下方式收集您的数据：
          </p>
          <ul>
            <li><strong>直接互动</strong>：当您注册账户、填写表单或与我们通信时。</li>
            <li><strong>自动技术</strong>：当您与我们的网站交互时，我们会自动收集技术数据。</li>
            <li><strong>第三方</strong>：我们可能从第三方服务提供商那里接收数据。</li>
          </ul>

          <h2>我们如何使用您的个人数据</h2>
          <p>我们仅在法律允许的情况下使用您的个人数据。最常见的情况是：</p>
          <ul>
            <li>为了履行与您签订的合同。</li>
            <li>当它符合我们的合法利益（且不会超过您的权利）。</li>
            <li>为了遵守法律或监管义务。</li>
            <li>在您同意的情况下。</li>
          </ul>

          <h2>数据安全</h2>
          <p>
            我们已经实施了适当的安全措施，以防止您的个人数据被意外丢失、未经授权使用或访问、更改或披露。此外，我们限制只有出于业务需要的员工和第三方服务商才能访问您的个人数据。
          </p>

          <h2>数据保留</h2>
          <p>
            我们只会在满足收集目的所需的时间内保留您的个人数据，包括出于法律、会计或报告要求的目的。
          </p>

          <h2>您的法律权利</h2>
          <p>
            根据数据保护法，您有权：
          </p>
          <ul>
            <li>请求访问您的个人数据。</li>
            <li>请求更正您的个人数据。</li>
            <li>请求删除您的个人数据。</li>
            <li>反对处理您的个人数据。</li>
            <li>请求限制处理您的个人数据。</li>
            <li>请求转移您的个人数据。</li>
            <li>撤回同意。</li>
          </ul>

          <h2>Cookie政策</h2>
          <p>
            我们使用Cookie和类似技术来区分您与我们网站的其他用户。这有助于我们为您提供良好的体验，并使我们能够改进我们的网站。
          </p>
          <p>
            您可以设置浏览器拒绝所有或部分浏览器Cookie，或在网站设置Cookie时提醒您。如果您禁用或拒绝Cookie，请注意网站的某些部分可能无法访问或无法正常工作。
          </p>

          <h2>第三方链接</h2>
          <p>
            本网站可能包含指向第三方网站、插件和应用程序的链接。点击这些链接或启用这些连接可能允许第三方收集或共享有关您的数据。我们不控制这些第三方网站，也不对其隐私声明负责。
          </p>

          <h2>隐私政策的变更</h2>
          <p>
            我们可能会不时更新我们的隐私政策。我们会通过在此页面上发布新版本的方式通知您任何变更。建议您定期查看此页面以了解任何变更。
          </p>

          <h2>联系我们</h2>
          <p>
            如果您对本隐私政策有任何问题，或想行使您的法律权利，请通过以下方式联系我们：
          </p>
          <p>
            电子邮件：<a href="mailto:privacy@logocraftai.com" className="text-blue-600 hover:underline">privacy@logocraftai.com</a>
          </p>
          <p>
            感谢您抽出时间阅读我们的隐私政策。
          </p>
        </div>
      </div>
    </main>
  );
} 