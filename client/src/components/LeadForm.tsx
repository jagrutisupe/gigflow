import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLead, updateLead } from '../api/leads';
import type { Lead } from '../types';

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type FormData = z.infer<typeof schema>;

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LeadForm = ({ lead, onClose, onSuccess }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: lead ?? { status: 'New', source: 'Website' },
  });

  const onSubmit = async (data: FormData) => {
    if (lead) await updateLead(lead._id, data);
    else await createLead(data);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">{lead ? 'Edit Lead' : 'Add Lead'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <input {...register('name')} placeholder="Name" className="border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input {...register('email')} placeholder="Email" className="border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <select {...register('status')} className="border p-2 rounded">
            {['New','Contacted','Qualified','Lost'].map(s => <option key={s}>{s}</option>)}
          </select>

          <select {...register('source')} className="border p-2 rounded">
            {['Website','Instagram','Referral'].map(s => <option key={s}>{s}</option>)}
          </select>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border py-2 rounded hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;