'use client';

import { ReactElement } from 'react';
import { FormGroup, FormGroupButton, FormGroupField, FormGroupFieldSelect } from '@/components/forms/FormGroup';
import { Jumbotron, JumbotronHeader, JumbotronRow } from '@/components/Jumbotron';
import Link from 'next/link';

export default function WalletOverviewPage(): ReactElement {
  return (
    <div className="mt-16 flex flex-wrap justify-center">
      <div className="w-2/3">
        <Jumbotron>
          <FormGroup
            validateOnBlur={false}
            className="flex flex-col"
            onSubmit={(form) => {}}
            initialValues={{
              amount: 0,
            }}
          >
            <JumbotronRow>
              <FormGroupField label="Amount" type="number" name="amount" value={0} />
              <FormGroupField label="Asset" type="number" name="amount" value={0} />
            </JumbotronRow>
            <JumbotronRow>
              <FormGroupFieldSelect className="col-span-2" label="From" type="number" name="amount" value={0} />
            </JumbotronRow>
            <JumbotronRow>
              <FormGroupField
                className="col-span-2"
                label="To"
                type="text"
                name="to"
                placeholder="Input address here"
              />
            </JumbotronRow>
            <div className="m-5 mt-10 flex justify-end">
              <FormGroupButton className="!bg-brand-500/90 !px-4 text-white transition">Send</FormGroupButton>
            </div>
          </FormGroup>
        </Jumbotron>
      </div>
    </div>
  );
}
