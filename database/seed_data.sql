-- PlantAI Realistic Seed Data
-- Database: plant_ai

USE plant_ai;

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(1, 'Hibiscus rosa-sinensis', 'Hibiscus', 'Requires 6 to 8 hours of direct bright sunlight daily for vibrant blooming.', 'Water thoroughly when the top inch of soil is dry. Avoid waterlogging.', 'Well-draining, nutrient-rich loamy soil with slightly acidic to neutral pH (6.0-7.0).', 'Large pot (12-16 inches) with ample drainage holes.', 'Sunny balcony, terrace, or south-facing garden patio.', 'Prune in early spring to encourage bushy growth; feed with high-potassium fertilizer during flowering season.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(2, 'Jasminum sambac', 'Jasmine / Mogra', 'Full sun to partial shade; at least 4-6 hours of sunlight for maximum fragrance and flowers.', 'Keep soil consistently moist during flowering season, but reduce watering in winter.', 'Rich, well-aerated, sandy-loam soil with good drainage and organic compost.', 'Medium to large container (10-14 inches) with good drainage.', 'Balcony railing, terrace garden, or bright sunny window.', 'Pinch growing tips to promote branching; apply organic vermicompost monthly.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(3, 'Rosa', 'Rose', 'Direct sunlight for at least 6 hours every day is essential for healthy buds.', 'Water deeply early in the morning at the base; keep foliage dry to prevent fungal diseases.', 'Rich, well-draining loamy soil enriched with compost and aged cow manure (pH 6.5).', 'Deep pot (14-18 inches) allowing deep root penetration with drainage holes.', 'Outdoor garden bed, sunny balcony, or open rooftop terrace.', 'Deadhead spent flowers regularly to stimulate new blossoms; spray neem oil to deter aphids and black spot.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(4, 'Tagetes', 'Marigold', 'Full direct sun is best (6+ hours daily); tolerates intense heat very well.', 'Water when topsoil feels dry; moderately drought tolerant once established.', 'Well-draining garden soil, not overly rich in nitrogen to prevent excessive foliage over flowers.', 'Standard 8-10 inch pot or window boxes with bottom drainage.', 'Garden borders, sunny verandas, or terrace planters.', 'Deadhead regularly to extend blooming period; naturally repels garden pests and nematodes.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(5, 'Helianthus annuus', 'Sunflower', 'Direct full sunlight for 6-8 hours daily; heliotropic tracking of the sun when young.', 'Water deeply once or twice a week; tolerates brief dry spells once deep roots develop.', 'Well-draining, loose nutrient-rich soil that allows deep taproot development.', 'Deep container (5 gallon / 12-16 inches) or open garden ground.', 'Open outdoor area, farm border, or rooftop garden with full southern exposure.', 'Stake tall varieties against high winds; protect ripening seed heads from hungry birds.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(6, 'Bougainvillea', 'Bougainvillea', 'Full, intense sunlight (at least 6 hours daily) is required for prolific bract coloration.', 'Drought tolerant; water only when the entire soil ball is dry. Overwatering inhibits flowering.', 'Gritty, well-draining sandy loam or cactus mix; thrives in slightly dry conditions.', 'Medium to large terracotta or cement pot with generous drainage holes.', 'Outdoor sunny walls, terrace trellises, or sunny balconies.', 'Prune after each blooming cycle to shape; minimal fertilizer needed as rich soil reduces colorful bracts.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(7, 'Mangifera indica', 'Mango', 'Full tropical sun (8+ hours daily) needed for vigorous vegetative growth and fruit set.', 'Water regularly while young; mature trees need deep watering during flowering and fruit development.', 'Deep, fertile, well-draining alluvial or red loamy soil (pH 5.5-7.5).', 'Large planter / half-barrel (20+ inches) for dwarf varieties, or open ground.', 'Open orchard, backyard, or spacious sunny terrace.', 'Prune dead wood after harvest; protect emerging blossoms from powdery mildew.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(8, 'Musa', 'Banana', 'Full direct sun to light dappled shade (6-8 hours); sheltered from strong winds.', 'High water requirement; keep soil evenly moist without standing stagnant water.', 'Rich, organic-heavy soil with plenty of compost and excellent drainage (pH 5.5-6.5).', 'Large container (minimum 15-20 gallons) for dwarf varieties or open garden.', 'Warm, humid outdoor location protected from heavy wind storms.', 'Heavy feeder; fertilize every month with balanced organic fertilizer rich in potassium.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(9, 'Psidium guajava', 'Guava', 'Thrives in full sun (6+ hours daily); highly resilient in warm climates.', 'Water regularly when young; once established, water every 7-10 days during dry spells.', 'Adaptable to various soils, prefers well-drained fertile loamy soil (pH 5.0-7.0).', 'Large container (16-20 inches) with proper drainage for potted cultivation.', 'Sunny terrace, courtyard, or garden orchard.', 'Prune annually to maintain canopy height and stimulate fruit-bearing shoots.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(10, 'Carica papaya', 'Papaya', 'Full sun (6-8 hours daily); needs warm conditions and high light intensity.', 'Moderate watering; extremely sensitive to waterlogging which causes root rot.', 'Light, porous, rich sandy loam with rapid drainage.', 'Large container (18-24 inches) with multiple drainage holes or ground planting.', 'Sunny backyard, open warm courtyard, or greenhouse.', 'Add organic compost around the drip line; mulch root zone to conserve moisture.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(11, 'Punica granatum', 'Pomegranate', 'Full direct sun for 6-8 hours daily for optimal sweet fruit production.', 'Water when top 2 inches of soil become dry; moderately drought tolerant.', 'Well-draining sandy or loamy soil; tolerates slightly alkaline soil well.', '14-18 inch container with good drainage holes.', 'Sunny balcony, sunny rooftop garden, or open backyard.', 'Prune suckers from base to maintain a neat single-stem or multi-stem tree.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(12, 'Solanum lycopersicum', 'Tomato', 'Full direct sun (6-8 hours daily) essential for robust growth and sweet tomatoes.', 'Water consistently at base when topsoil feels dry; erratic watering causes blossom end rot.', 'Nutrient-rich, loose, well-draining loamy soil enriched with compost (pH 6.2-6.8).', '12-16 inch deep container per plant with bottom drainage.', 'Sunny patio, balcony, or vegetable garden patch.', 'Provide a sturdy cage or stake for support; prune lower suckers to improve air circulation.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(13, 'Solanum melongena', 'Brinjal / Eggplant', 'Full sun (6+ hours daily); warm-season vegetable that loves heat.', 'Keep soil consistently moist; water deeply 2-3 times a week during fruiting.', 'Rich, loamy, well-draining soil with abundant organic matter.', '12-14 inch pot with drainage holes.', 'Sunny vegetable garden or rooftop vegetable bed.', 'Stake plants when heavy with fruit; watch for flea beetles and apply neem spray.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(14, 'Capsicum annuum', 'Chilli / Pepper', 'Direct bright sun for 6-8 hours daily to boost flower and fruit setting.', 'Water when top inch of soil dries; avoid overwatering which causes leaf drop.', 'Fertile, well-aerated, well-draining potting soil with compost.', '10-12 inch pot with good drainage.', 'Sunny windowsill, balcony planter, or garden bed.', 'Pinch early blossoms on young plants to build stronger vegetative stems before fruiting.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(15, 'Abelmoschus esculentus', 'Okra / Lady Finger', 'Full sun (6-8 hours daily); thrives in warm tropical temperatures.', 'Water moderately; soak soil when dry, avoid water standing around roots.', 'Well-draining fertile sandy loam with plenty of organic matter.', '12-14 inch container with drainage holes.', 'Sunny terrace vegetable garden or outdoor raised bed.', 'Harvest tender pods every 2-3 days to encourage continuous new flowering and pod production.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(16, 'Solanum tuberosum', 'Potato', 'Full sun (6 hours daily); foliage needs sunlight while tubers develop underground.', 'Moderate, regular watering; keep soil moist during tuber formation, reduce before harvest.', 'Loose, well-aerated, acidic sandy loam (pH 5.0-6.0) free of rocks.', 'Grow bag (10-15 gallons) or 16-inch deep container.', 'Sunny outdoor patio, backyard, or rooftop terrace.', 'Hill soil or straw around stems as they grow to prevent exposed potatoes from turning green.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(17, 'Spinacia oleracea', 'Spinach', 'Partial shade to full morning sun (3-5 hours daily); cool-season crop.', 'Keep soil consistently moist; shallow roots need frequent light watering.', 'Rich, moisture-retentive, well-draining soil with high nitrogen content.', 'Wide, shallow container (6-8 inches deep) with good drainage.', 'Semi-shaded balcony, kitchen windowsill, or vegetable bed.', 'Harvest outer leaves as needed to allow central crown to keep producing fresh greens.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(18, 'Ocimum tenuiflorum', 'Tulsi / Holy Basil', 'Needs 4-6 hours of daily sunlight; thrives in bright, warm environments.', 'Water when the top surface feels slightly dry; avoid soggy or waterlogged soil.', 'Well-draining potting mix enriched with vermicompost and sand (pH 6.0-7.5).', '8-10 inch terracotta pot with bottom drainage hole.', 'East or North-facing balcony, courtyard, or bright prayer area.', 'Pinch flower buds (manjari) regularly to keep the plant lush and bushy; spray diluted neem oil for aphid control.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(19, 'Mentha', 'Mint', 'Prefers bright indirect light to morning sun (3-4 hours); protect from scorching afternoon sun.', 'Keep soil consistently damp; mint loves moisture and wilts quickly when dry.', 'Moist, rich, well-draining soil high in organic matter.', 'Wide, shallow container (8-10 inches) with drainage holes (keep separated to prevent invasive spread).', 'Kitchen windowsill, shaded balcony, or patio planter.', 'Harvest tips frequently to encourage bushy branching and prevent flowering.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(20, 'Coriandrum sativum', 'Coriander / Cilantro', 'Morning sun or bright filtered sunlight (4-5 hours); shade from hot midday sun.', 'Water regularly to maintain moist soil; avoid over-saturating.', 'Light, loose, fast-draining potting soil with compost.', 'Shallow, wide container (6-8 inches deep) with drainage.', 'Kitchen garden windowsill or semi-shaded balcony.', 'Harvest outer stems first; sow successive batches every 2-3 weeks for continuous supply.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(21, 'Aloe vera', 'Aloe Vera', 'Bright indirect light or gentle morning sun (4-6 hours); avoid intense scorching direct heat.', 'Allow soil to dry out completely between waterings; water deeply every 2-3 weeks.', 'Gritty, fast-draining cactus or succulent potting mix with coarse sand/perlite.', 'Terracotta pot with drainage holes (terracotta allows soil to breathe).', 'Sunny windowsill, indoor desk near window, or sheltered patio.', 'Never let water sit in the central rosette; propagate healthy offshoots (pups) that sprout from base.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(22, 'Dracaena trifasciata', 'Snake Plant / Sansevieria', 'Extremely versatile: thrives in low light, medium light, or bright indirect sun.', 'Water sparingly every 2-4 weeks; allow soil to dry out completely between waterings.', 'Free-draining potting mix with perlite or pumice to prevent root rot.', 'Sturdy ceramic or terracotta pot with drainage holes.', 'Living room, bedroom, office desk, or low-light corners.', 'Wipe leaves periodically to remove dust; excellent indoor air purifying plant.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(23, 'Epipremnum aureum', 'Money Plant / Golden Pothos', 'Bright indirect sunlight; also tolerates moderate to low indoor light.', 'Water when top 1-2 inches of potting soil dries out; can also grow directly in clean water jars.', 'Lightweight, well-draining indoor potting mix rich in organic compost.', 'Hanging basket, tabletop planter (6-8 inches), or water vase.', 'Living room, balcony shade, office desk, or bookshelf trailing vine.', 'Clean leaves with damp cloth; trim trailing vines to maintain desired length and bushiness.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(24, 'Spathiphyllum', 'Peace Lily', 'Medium to low indirect light; sensitive to harsh direct sunlight which scorches leaves.', 'Water when the top inch of soil feels dry or when leaves begin to gently droop.', 'Rich, loose, well-draining potting soil with peat and perlite.', '8-10 inch container with good bottom drainage.', 'Indoor living room, hallway, office, or bedroom.', 'Wipe broad leaves to keep them glossy; remove fading flower spathes to encourage new blooms.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(25, 'Chlorophytum comosum', 'Spider Plant', 'Bright indirect light; avoid harsh direct sun that burns leaf tips.', 'Water moderately once a week; allow soil surface to dry between waterings.', 'Well-draining, standard potting soil with perlite.', 'Hanging basket or 6-8 inch pot with drainage holes.', 'Indoor living area, bright bathroom, or shaded patio.', 'Snip spiderettes (baby plantlets) and root them in water or potting soil for easy propagation.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(26, 'Dypsis lutescens', 'Areca Palm', 'Bright filtered light or dappled sunlight; protect from harsh direct afternoon sun.', 'Keep soil lightly moist; water when top inch of soil is dry to touch.', 'Rich, well-draining loamy potting mix with peat and sand.', 'Large pot (12-16 inches) with generous drainage.', 'Bright living room corner, foyer, covered balcony, or terrace.', 'Mist fronds in dry climates to maintain humidity; feed with diluted liquid fertilizer in spring.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(27, 'Azadirachta indica', 'Neem', 'Full sun (6-8 hours daily); highly resilient in warm, arid, and tropical conditions.', 'Water moderately while young; mature trees are exceptionally drought-tolerant.', 'Well-draining sandy, clayey, or stony soil; highly adaptable.', 'Large tub (18-24 inches) when young, or open garden ground.', 'Sunny outdoor courtyard, garden boundary, or rooftop terrace.', 'Naturally resistant to pests; leaves and extracts are widely used in botanical medicine.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(28, 'Ficus religiosa', 'Peepal / Sacred Fig', 'Full sun to partial shade (4-6 hours daily); vigorous and hardy.', 'Water moderately; allow surface soil to dry out between waterings.', 'Well-draining, nutrient-rich soil; adaptable to rocky or poor soils.', 'Large deep container (16-20 inches) or bonsai pot for training.', 'Spacious terrace, sunny courtyard, or garden.', 'Prune roots and branches if growing in containers or bonsai to control vigorous growth.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(29, 'Cocos nucifera', 'Coconut Palm', 'Full direct tropical sun (6-8 hours daily); requires high warmth and humidity.', 'Water deeply and regularly; thrives with ample moisture and good soil drainage.', 'Sandy, coastal, or well-draining loamy soil with organic matter.', 'Large planter / half-barrel (20+ inches) during juvenile stage or open ground.', 'Sunny outdoor garden, beachside landscape, or open farm.', 'Apply salt-tolerant organic fertilizer and compost around base annually.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);

INSERT INTO plant_care (id, plant_name, common_name, sunlight, water, soil, container, location, care)
VALUES
(30, 'Catharanthus roseus', 'Periwinkle / Sadabahar', 'Full sun to partial shade (4-6 hours daily); prolific all-year bloomer.', 'Water when top 1-2 inches of soil dries; drought-tolerant once established.', 'Well-draining sandy loam or general potting soil; dislikes soggy waterlogged soil.', '8-10 inch pot or window box with drainage.', 'Sunny balcony, garden border, or porch planter.', 'Prune stems occasionally to prevent legginess and promote dense flowering stems.')
ON DUPLICATE KEY UPDATE 
common_name=VALUES(common_name), sunlight=VALUES(sunlight), water=VALUES(water), soil=VALUES(soil), container=VALUES(container), location=VALUES(location), care=VALUES(care);
