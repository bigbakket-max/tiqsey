import { POPULAR_ATTRACTIONS } from "./src/data/mockData";

const hotDealsList = POPULAR_ATTRACTIONS.filter(
  (attr) => attr.discountPrice && attr.discountPrice < attr.price,
);

const result = [...hotDealsList];

result.sort((a, b) => {
  const priceA = a.discountPrice ?? a.price;
  const priceB = b.discountPrice ?? b.price;
  const savedA = a.price - priceA;
  const savedB = b.price - priceB;
  const ratioA = (savedA / a.price) * 100;
  const ratioB = (savedB / b.price) * 100;
  return ratioB - ratioA;
});

result.slice(0, 10).forEach((attr, idx) => {
  console.log(`${idx + 1}: ID=${attr.id}, Name="${attr.name}", ImageURL=${attr.imageUrl}`);
});
