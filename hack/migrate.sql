-- migrate.sql


CREATE TABLE IF NOT EXISTS bak.product_type (
    id uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at timestamp with time zone NOT NULL
);

ALTER TABLE bak.product_type ADD CONSTRAINT product_type_name_key UNIQUE (name);
CREATE INDEX IF NOT EXISTS product_type_name_like ON bak.product_type USING btree (name varchar_pattern_ops);


-- insert default type
INSERT INTO bak.product_type (name, id, created_at)
VALUES
('NA', '7016114a-323b-4280-a1a4-15ff037f24df', '2024-03-12 07:33:46.454523+00');

CREATE TABLE IF NOT EXISTS bak.product_producer (
    id uuid PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at timestamp with time zone NOT NULL
);

ALTER TABLE bak.product_producer ADD CONSTRAINT product_producer_name_key UNIQUE (name);
CREATE INDEX IF NOT EXISTS product_producer_name_like ON bak.product_producer USING btree (name varchar_pattern_ops);

-- insert data
INSERT INTO bak.product_producer (name, id, created_at) 
VALUES
('OXOID', '98797ea0-f8fb-435e-9a46-8341a953d889', '2024-03-12 07:33:46.454523+00'),
('r-biopharm', '0c78c2b5-cf30-477a-ba6c-6d54e7f3f97a', '2024-03-12 07:33:46.454523+00'),
('BD', '2c31c767-e108-4a67-bbc4-5b43884d48db', '2024-03-12 07:33:46.454523+00'),
('bioM', '8c11667f-42fd-439e-a9e7-20376bee0b27', '2024-03-12 07:33:46.454523+00'),
('bioMerieux', '06cf9010-fb9c-4623-bd0a-86a43b451db5', '2024-03-12 07:33:46.454523+00'),
('MAST', '9be3c307-53b6-4d48-8cd5-05a75b86d22e', '2024-03-12 07:33:46.454523+00');

-- rename table
ALTER TABLE bak.type RENAME TO product;
-- rename foreign key constraint
ALTER TABLE bak.lot RENAME COLUMN type_id TO product_id;

-- rename bak.product.producer to bak.product.producer_id


-- add column product_producer to bak.product
ALTER TABLE bak.product ADD COLUMN producer_id uuid;
-- populate it by using the old producer column and matching the producer with product_producer names
UPDATE bak.product SET producer_id = producer.id FROM bak.product_producer producer WHERE producer.name = bak.product.producer;
-- drop the old producer column
ALTER TABLE bak.product DROP COLUMN producer;
-- add foreign key constraint
ALTER TABLE bak.product ADD CONSTRAINT product_producer_id_fk FOREIGN KEY (producer_id) REFERENCES bak.product_producer(id);

-- add column product_type to bak.product with default value 'NA'
ALTER TABLE bak.product ADD COLUMN type_id uuid DEFAULT '7016114a-323b-4280-a1a4-15ff037f24df';
-- add foreign key constraint
ALTER TABLE bak.product ADD CONSTRAINT product_type_id_fk FOREIGN KEY (type_id) REFERENCES bak.product_type(id);

-- name non nullable
ALTER TABLE bak.product ALTER COLUMN producer_id SET NOT NULL;
ALTER TABLE bak.product ALTER COLUMN type_id SET NOT NULL;

-- Create unique constraint for product name and producer_id
ALTER TABLE bak.product ADD CONSTRAINT product_name_producer_id_key UNIQUE (name, producer_id);