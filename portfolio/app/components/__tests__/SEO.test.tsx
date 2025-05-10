import { render } from '../../test-utils';
import SEO from '../SEO';

describe('SEO', () => {
  it('renders with default props', () => {
    const { container } = render(<SEO />);
    const head = container.querySelector('head');
    expect(head).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const title = 'Custom Title';
    const { container } = render(<SEO title={title} />);
    const titleElement = container.querySelector('title');
    expect(titleElement).toHaveTextContent(title);
  });

  it('renders with custom description', () => {
    const description = 'Custom Description';
    const { container } = render(<SEO description={description} />);
    const metaDescription = container.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute('content', description);
  });

  it('renders with custom keywords', () => {
    const keywords = ['react', 'nextjs', 'portfolio'];
    const { container } = render(<SEO keywords={keywords} />);
    const metaKeywords = container.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toHaveAttribute('content', keywords.join(', '));
  });

  it('renders with custom og:image', () => {
    const ogImage = 'https://example.com/image.jpg';
    const { container } = render(<SEO ogImage={ogImage} />);
    const metaOgImage = container.querySelector('meta[property="og:image"]');
    expect(metaOgImage).toHaveAttribute('content', ogImage);
  });

  it('renders with custom og:type', () => {
    const ogType = 'website';
    const { container } = render(<SEO ogType={ogType} />);
    const metaOgType = container.querySelector('meta[property="og:type"]');
    expect(metaOgType).toHaveAttribute('content', ogType);
  });

  it('renders with custom twitter:card', () => {
    const twitterCard = 'summary_large_image';
    const { container } = render(<SEO twitterCard={twitterCard} />);
    const metaTwitterCard = container.querySelector('meta[name="twitter:card"]');
    expect(metaTwitterCard).toHaveAttribute('content', twitterCard);
  });
}); 