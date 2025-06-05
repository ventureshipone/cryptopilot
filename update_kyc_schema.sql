-- Add missing columns to kyc_requests table

-- First, check if these columns already exist (to avoid errors)
DO $$
BEGIN
    -- Enhanced KYC fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'country') THEN
        ALTER TABLE kyc_requests ADD COLUMN country TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'address') THEN
        ALTER TABLE kyc_requests ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'postal_code') THEN
        ALTER TABLE kyc_requests ADD COLUMN postal_code TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'city') THEN
        ALTER TABLE kyc_requests ADD COLUMN city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'state') THEN
        ALTER TABLE kyc_requests ADD COLUMN state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'email') THEN
        ALTER TABLE kyc_requests ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'phone_number') THEN
        ALTER TABLE kyc_requests ADD COLUMN phone_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'occupation') THEN
        ALTER TABLE kyc_requests ADD COLUMN occupation TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'employer_name') THEN
        ALTER TABLE kyc_requests ADD COLUMN employer_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'source_of_funds') THEN
        ALTER TABLE kyc_requests ADD COLUMN source_of_funds TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'purpose_of_account') THEN
        ALTER TABLE kyc_requests ADD COLUMN purpose_of_account TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'id_expiry_date') THEN
        ALTER TABLE kyc_requests ADD COLUMN id_expiry_date TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'additional_document') THEN
        ALTER TABLE kyc_requests ADD COLUMN additional_document TEXT;
    END IF;
    
    -- Financial risk assessment fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'financial_risk_overall') THEN
        ALTER TABLE kyc_requests ADD COLUMN financial_risk_overall TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'financial_risk_source_of_funds') THEN
        ALTER TABLE kyc_requests ADD COLUMN financial_risk_source_of_funds TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'financial_risk_purpose_of_account') THEN
        ALTER TABLE kyc_requests ADD COLUMN financial_risk_purpose_of_account TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'financial_risk_occupation') THEN
        ALTER TABLE kyc_requests ADD COLUMN financial_risk_occupation TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kyc_requests' AND column_name = 'financial_risk_comments') THEN
        ALTER TABLE kyc_requests ADD COLUMN financial_risk_comments TEXT;
    END IF;
    
END $$;