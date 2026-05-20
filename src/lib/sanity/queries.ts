import { defineQuery } from "next-sanity";

const localizedString = (field: string) => `
  "raw${field[0].toUpperCase()}${field.slice(1)}": ${field},
  "${field}": select(
    $locale == "it" && defined(${field}.it) => ${field}.it,
    ${field}.en
  )
`;

const localizedSlug = `
  "rawSlug": slug,
  "slug": select(
    $locale == "it" && defined(slug.it.current) => slug.it.current,
    slug.en.current
  )
`;

const localizedBody = `
  "body": select(
    $locale == "it" && defined(body.it) => body.it,
    body.en
  )
`;

const POST_FIELDS = `
  _id,
  _createdAt,
  ${localizedString("title")},
  ${localizedSlug},
  ${localizedString("excerpt")},
  "publishedAt": coalesce(publishedAt, _createdAt),
  updatedAt,
  readingTime,
  tags,
  customTags,
  ${localizedString("seoTitle")},
  ${localizedString("seoDescription")},
  canonicalUrl,
  author,
  language,
  ${localizedString("coverImageAlt")},
  coverImage{
    ...,
    asset->{
      _id,
      url,
      metadata{
        lqip,
        dimensions{
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  ogImage{
    ...,
    asset->{
      _id,
      url,
      metadata{
        lqip,
        dimensions{
          width,
          height,
          aspectRatio
        }
      }
    }
  },
  relatedPosts[]->{
    _id,
    _createdAt,
    ${localizedString("title")},
    ${localizedSlug},
    ${localizedString("excerpt")},
    "publishedAt": coalesce(publishedAt, _createdAt),
    readingTime,
    tags,
    customTags,
    ${localizedString("coverImageAlt")},
    coverImage{
      ...,
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }
      }
    }
  },
  ${localizedBody}[]{
    ...,
    markDefs[]{
      ...,
      _type == "link" => {
        ...,
        href,
        openInNewTab
      }
    },
    _type == "imageBlock" => {
      ...,
      image{
        ...,
        asset->{
          _id,
          url,
          metadata{
            lqip,
            dimensions{
              width,
              height,
              aspectRatio
            }
          }
        }
      }
    },
    _type == "resourceCard" => {
      ...,
      image{
        ...,
        asset->{
          _id,
          url,
          metadata{
            lqip,
            dimensions{
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      linkedPost->{
        _id,
        ${localizedString("title")},
        ${localizedSlug}
      }
    },
    _type == "suggestedReadings" => {
      ...,
      posts[]->{
        _id,
        _createdAt,
        ${localizedString("title")},
        ${localizedSlug},
        ${localizedString("excerpt")},
        "publishedAt": coalesce(publishedAt, _createdAt),
        readingTime,
        tags,
        customTags,
        ${localizedString("coverImageAlt")},
        coverImage{
          ...,
          asset->{
            _id,
            url,
            metadata{
              lqip,
              dimensions{
                width,
                height,
                aspectRatio
              }
            }
          }
        }
      }
    }
  }
`;

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.en.current)]
  | order(coalesce(publishedAt, _createdAt) desc) {
    ${POST_FIELDS}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.en.current)][]{
    "slug": select(
      $locale == "it" && defined(slug.it.current) => slug.it.current,
      slug.en.current
    )
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "post" && (
      slug.en.current == $slug ||
      slug.it.current == $slug
    )
  ][0]{
    ${POST_FIELDS}
  }
`);
