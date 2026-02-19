import { supabase } from '../lib/supabase';
import { Constants } from '../types/supabase';

// Helper to check schema errors
function isSchemaError(error) {
  if (!error) return false;

  if (error?.code && typeof error?.code === 'string') {
    const errorClass = error?.code?.substring(0, 2);
    if (errorClass === '42' || errorClass === '08') return true;
    if (errorClass === '23') return false;
  }

  if (error?.message) {
    const schemaErrorPatterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /invalid.*syntax/i,
      /type.*does not exist/i,
      /undefined.*column/i,
      /undefined.*table/i,
      /undefined.*function/i,
    ];
    return schemaErrorPatterns?.some(pattern => pattern?.test(error?.message));
  }

  return false;
}
export const getUserId = async () => {
  const { data: { user } } = await supabase?.auth?.getUser();
  return user?.id;
}
// Convert snake_case to camelCase
export const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj?.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)?.reduce((acc, key) => {
      const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
      acc[camelKey] = toCamelCase(obj?.[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj?.map(toSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)?.reduce((acc, key) => {
      const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
      acc[snakeKey] = toSnakeCase(obj?.[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Bookings Service
export const bookingsService = {
  async getDayBookings(date) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('bookings')?.select('*')?.eq('user_id', user?.id)?.eq('date', date)?.order('date', { ascending: true });
    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Bookings fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  },

  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('bookings')?.select('*')?.eq('user_id', user?.id)?.order('date', { ascending: true });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Bookings fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  },

  async create(booking, costBreakdown) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');
    console.log('Creating booking with data:', booking, 'and cost breakdown:', costBreakdown);
    const bookingData = toSnakeCase({ ...booking, userId: user?.id });
    console.log('User info:', bookingData.userId);
    const { data, error } = await supabase?.from('bookings')?.insert({
      date: bookingData.date,
      user_id: bookingData.user_id,
      client_name: bookingData.client_name,
      phone: bookingData.phone,
      shoot_type: bookingData.shoot_type,
      duration: bookingData.duration,
      time: bookingData.time,
      price: bookingData.price,
      status: bookingData.status,
      invoice_sent: bookingData.invoice_sent,
      advance: bookingData.advance,
      deliverables: bookingData.deliverables,
      payment_status: bookingData.payment_done,
      notes: bookingData.notes,
      location: bookingData.location,
      gst: bookingData.gst
    })?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Booking create error:', error?.message);
      return null;
    }
    this.updateCosts(data?.id, costBreakdown || []);
    return toCamelCase(data);
  },

  async update(id, updates, costBreakdown) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');
    const updateData = toSnakeCase({ ...updates, userId: user?.id });
    const { data, error } = await supabase?.from('bookings')?.update({
      user_id: updateData.user_id,
      date: updateData.date,
      client_name: updateData.client_name,
      phone: updateData.phone,
      shoot_type: updateData.shoot_type,
      duration: updateData.duration,
      time: updateData.time,
      price: updateData.price,
      status: updateData.status,
      invoice_sent: updateData.invoice_sent,
      advance: updateData.advance,
      deliverables: updateData.deliverables,
      payment_status: updateData.payment_done,
      notes: updateData.notes,
      location: updateData.location,
      gst: updateData.gst
    })?.eq('id', updateData.id)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Booking update error:', error?.message);
      return null;
    }
    this.updateCosts(updateData.id, costBreakdown || []);
    return toCamelCase(data);
  },

  async delete(id) {
    const { error } = await supabase?.from('bookings')?.delete()?.eq('id', id);

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Booking delete error:', error?.message);
      return false;
    }
    return true;
  },

  // Add/ update booking costs
  async updateCosts(id, costBreakdown) {
    const costsData = toSnakeCase(costBreakdown)?.map(c => ({ ...c, booking_id: id }));
    const { error } = await supabase?.from('booking_costs')?.delete()?.eq('booking_id', id);
    if (costsData && costsData?.length > 0) {
      const { error: insertError } = await supabase?.from('booking_costs')?.insert(costsData);
      if (insertError) throw insertError;
    }
    if (error) {
      console.error('Booking update error:', error?.message);
      return null;
    }
  },

  async getCosts(id) {
    const { data, error } = await supabase?.from('booking_costs')?.select('*')?.eq('booking_id', id);
    if (error) {
      console.error('Booking costs fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  }
};

// Tasks Service
export const tasksService = {
  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('tasks')?.select(`
        *,
        assignees:task_assignees(*, assignee:assignees(id, name, avatar, avatar_alt)),
        subtasks:task_subtasks(*)
      `)?.eq('user_id', user?.id)?.order('position', { ascending: true });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Tasks fetch error:', error?.message);
      return [];
    }

    // Normalize assignees so UI can use { name, avatar, avatarAlt } regardless of whether
    // task_assignees stores a snapshot or references `assignees` table
    const tasks = toCamelCase(data || []).map((t) => {
      const normalizedAssignees = (t.assignees || []).map((a) => ({
        id: a?.id,
        taskId: a?.taskId || a?.task_id,
        assigneeId: a?.assignee?.id || a?.assigneeId || a?.assignee_id || null,
        name: a?.name || (a?.assignee && a?.assignee.name) || null,
        avatar: a?.avatar || (a?.assignee && a?.assignee.avatar) || null,
        avatarAlt: a?.avatarAlt || (a?.assignee && a?.assignee.avatarAlt) || null,
        createdAt: a?.createdAt || a?.created_at
      }));
      return { ...t, assignees: normalizedAssignees };
    });

    return tasks;
  },

  async getUrgentTasks() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = new Date().toISOString();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data, error } = await supabase?.from('tasks')
      ?.select(`
        *,
        assignees:task_assignees(*, assignee:assignees(id, name, avatar, avatar_alt)),
        subtasks:task_subtasks(*)`)
      ?.eq('user_id', user?.id)
      ?.neq('status', 'done')?.or(`due_date.lt.${today},is_urgent.eq.true,and(priority.eq.high,due_date.lte.${nextWeek.toISOString()})`)
      ?.order('position', { ascending: true });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Tasks fetch error:', error?.message);
      return [];
    }

    // Normalize assignees so UI can use { name, avatar, avatarAlt } regardless of whether
    // task_assignees stores a snapshot or references `assignees` table
    const tasks = toCamelCase(data || []).map((t) => {
      const normalizedAssignees = (t.assignees || []).map((a) => ({
        id: a?.id,
        taskId: a?.taskId || a?.task_id,
        assigneeId: a?.assignee?.id || a?.assigneeId || a?.assignee_id || null,
        name: a?.name || (a?.assignee && a?.assignee.name) || null,
        avatar: a?.avatar || (a?.assignee && a?.assignee.avatar) || null,
        avatarAlt: a?.avatarAlt || (a?.assignee && a?.assignee.avatarAlt) || null,
        createdAt: a?.createdAt || a?.created_at
      }));
      return { ...t, assignees: normalizedAssignees };
    });

    return tasks;
  },

  async create(task) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { assignees, subtasks, ...taskData } = task;
    const taskDataSnake = toSnakeCase({ ...taskData, userId: user?.id });

    const { data: newTask, error: taskError } = await supabase?.from('tasks')?.insert(taskDataSnake)?.select()?.single();

    if (taskError) {
      if (isSchemaError(taskError)) throw taskError;
      console.error('Task create error:', taskError?.message);
      return null;
    }

    // Add subtasks if provided
    if (subtasks && subtasks?.length > 0) {
      const subtasksData = subtasks?.map((s, idx) => toSnakeCase({ ...s, taskId: newTask?.id, position: idx }));
      await supabase?.from('task_subtasks')?.insert(subtasksData);
    }

    // Add assignees if provided — resolve or create assignee ids and link via task_assignees
    if (assignees && assignees?.length > 0) {
      const resolveAssigneeId = async (a) => {
        // string name
        if (typeof a === 'string') {
          const { data: found, error: findErr } = await supabase
            .from('assignees')
            .select('id')
            .eq('name', a)
            .maybeSingle();
          if (findErr) {
            console.error('Error finding assignee by name:', findErr);
            return null;
          }
          if (found) return found.id;
          const { data: created, error: createErr } = await supabase
            .from('assignees')
            .insert({ name: a, user_id: user?.id })
            .select('id')
            .single();
          if (createErr) {
            console.error('Error creating assignee:', createErr);
            return null;
          }
          return created?.id;
        }

        // already have id
        if (a?.assigneeId || a?.id) return a?.assigneeId || a?.id;

        // object with name -> try to find or create
        if (a?.name) {
          const { data: found, error: findErr } = await supabase
            .from('assignees')
            .select('id')
            .eq('name', a.name)
            .maybeSingle();
          if (findErr) {
            console.error('Error finding assignee by name:', findErr);
            return null;
          }
          if (found) return found.id;
          const { data: created, error: createErr } = await supabase
            .from('assignees')
            .insert({ name: a.name, avatar: a?.avatar, avatar_alt: a?.avatarAlt, user_id: user?.id })
            .select('id')
            .single();
          if (createErr) {
            console.error('Error creating assignee:', createErr);
            return null;
          }
          return created?.id;
        }

        return null;
      };

      const ids = (await Promise.all(assignees.map(resolveAssigneeId))).filter(Boolean);

      if (ids.length > 0) {
        const taskAssigneesData = ids.map((assigneeId) => toSnakeCase({ assigneeId, taskId: newTask?.id }));
        await supabase?.from('task_assignees')?.insert(taskAssigneesData);
      }
    }

    return this.getById(newTask?.id);
  },

  async getById(id) {
    const { data, error } = await supabase?.from('tasks')?.select(`
        *,
        assignees:task_assignees(*, assignee:assignees(id, name, avatar, avatar_alt)),
        subtasks:task_subtasks(*)
      `)?.eq('id', id)?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }

    const task = toCamelCase(data || null);
    if (!task) return null;

    const normalizedAssignees = (task.assignees || []).map((a) => ({
      id: a?.id,
      taskId: a?.taskId || a?.task_id,
      assigneeId: a?.assignee?.id || a?.assigneeId || a?.assignee_id || null,
      name: a?.name || (a?.assignee && a?.assignee.name) || null,
      avatar: a?.avatar || (a?.assignee && a?.assignee.avatar) || null,
      avatarAlt: a?.avatarAlt || (a?.assignee && a?.assignee.avatarAlt) || null,
      createdAt: a?.createdAt || a?.created_at
    }));

    return { ...task, assignees: normalizedAssignees };
  },


  async update(id, updates) {
    const { assignees, subtasks, ...taskUpdates } = updates;
    const updateData = toSnakeCase(taskUpdates);

    const { data, error } = await supabase?.from('tasks')?.update(updateData)?.eq('id', id)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Task update error:', error?.message);
      return null;
    }

    // Update assignees if provided — resolve/create assignee ids and link
    if (assignees) {
      await supabase?.from('task_assignees')?.delete()?.eq('task_id', id);
      if (assignees?.length > 0) {
        const { data: { user } } = await supabase?.auth?.getUser();
        if (!user) throw new Error('Not authenticated');

        const resolveAssigneeId = async (a) => {
          if (typeof a === 'string') {
            const { data: found, error: findErr } = await supabase
              .from('assignees')
              .select('id')
              .eq('name', a)
              .maybeSingle();
            if (findErr) {
              console.error('Error finding assignee by name:', findErr);
              return null;
            }
            if (found) return found.id;
            const { data: created, error: createErr } = await supabase
              .from('assignees')
              .insert({ name: a, user_id: user?.id })
              .select('id')
              .single();
            if (createErr) {
              console.error('Error creating assignee:', createErr);
              return null;
            }
            return created?.id;
          }

          if (a?.assigneeId || a?.id) return a?.assigneeId || a?.id;

          if (a?.name) {
            const { data: found, error: findErr } = await supabase
              .from('assignees')
              .select('id')
              .eq('name', a.name)
              .maybeSingle();
            if (findErr) {
              console.error('Error finding assignee by name:', findErr);
              return null;
            }
            if (found) return found.id;
            const { data: created, error: createErr } = await supabase
              .from('assignees')
              .insert({ name: a.name, avatar: a?.avatar, avatar_alt: a?.avatarAlt, user_id: user?.id })
              .select('id')
              .single();
            if (createErr) {
              console.error('Error creating assignee:', createErr);
              return null;
            }
            return created?.id;
          }

          return null;
        };

        const ids = (await Promise.all(assignees.map(resolveAssigneeId))).filter(Boolean);
        if (ids.length > 0) {
          const taskAssigneesData = ids.map((assigneeId) => toSnakeCase({ assigneeId, taskId: id }));
          await supabase?.from('task_assignees')?.insert(taskAssigneesData);
        }
      }
    }

    // Update subtasks if provided
    if (subtasks) {
      await supabase?.from('task_subtasks')?.delete()?.eq('task_id', id);
      if (subtasks?.length > 0) {
        const subtasksData = subtasks?.map((s, idx) => toSnakeCase({ ...s, taskId: id, position: idx }));
        await supabase?.from('task_subtasks')?.insert(subtasksData);
      }
    }

    return this.getById(id);
  },

  async delete(id) {
    const { error } = await supabase?.from('tasks')?.delete()?.eq('id', id);

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Task delete error:', error?.message);
      return false;
    }
    return true;
  }
};

export const professionalService = {
  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('professionals')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Professionals fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  },

  async create(professional) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const professionalData = toSnakeCase({ ...professional, userId: user?.id });

    const { data, error } = await supabase?.from('professionals')?.insert(professionalData)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Professional create error:', error?.message);
      return null;
    }
    return toCamelCase(data);
  },

  async update(id, updates) {
    const updateData = toSnakeCase(updates);
    const { data, error } = await supabase?.from('professionals')?.update(updateData)?.eq('id', id)?.select()?.single();
    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Professional update error:', error?.message);
      return null;
    }

    return this.getProfessionalById(id);
  },

  async getProfessionalById(id) {
    const { data, error } = await supabase?.from('professionals')?.select()?.eq('id', id)?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return toCamelCase(data);
  },

  async delete(id) {
    const { error } = await supabase?.from('professionals')?.delete()?.eq('id', id);

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Professional delete error:', error?.message);
      return false;
    }
    return true;
  }
};

// Clients Service
export const clientsService = {
  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('clients')?.select()
      ?.eq('user_id', user?.id)?.order('created_at', { ascending: false });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Clients fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  },

  async create(client) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const clientDataSnake = toSnakeCase({ ...client, userId: user?.id });

    const { data: newClient, error: clientError } = await supabase?.from('clients')?.insert(clientDataSnake)?.select()?.single();

    if (clientError) {
      if (isSchemaError(clientError)) throw clientError;
      console.error('Client create error:', clientError?.message);
      return null;
    }
    return this.getById(newClient?.id);
  },

  async getById(id) {
    const { data, error } = await supabase?.from('clients')?.select()?.eq('id', id)?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return toCamelCase(data);
  },

  async update(id, updates) {
    const { timeline, communications, attachments, ...clientUpdates } = updates;
    const updateData = toSnakeCase(clientUpdates);

    const { data, error } = await supabase?.from('clients')?.update(updateData)?.eq('id', id)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Client update error:', error?.message);
      return null;
    }

    return this.getById(id);
  },

  async delete(id) {
    const { error } = await supabase?.from('clients')?.delete()?.eq('id', id);

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Client delete error:', error?.message);
      return false;
    }
    return true;
  },

  // Fetch distinct filter values (status, shoot types) from local clients table
  async getFilterValues() {
    const { data, error } = await supabase?.from('clients')?.select('status, shoot_types');
    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Error fetching filter values:', error?.message);
      return { statuses: [], shootTypes: [] };
    }

    const statuses = Array.from(new Set((data || []).map((d) => d?.status).filter(Boolean)));
    const shootTypes = Array.from(new Set((data || []).flatMap((d) => d?.shoot_types || []).filter(Boolean)));

    return { statuses, shootTypes };
  },

  async addCommunication(clientId, communication) {
    const commData = toSnakeCase({ ...communication, clientId });
    const { data, error } = await supabase?.from('client_communications')?.insert(commData)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return toCamelCase(data);
  }
};

export const userService = {
  // Users helper to fetch profile / admin state
  async isAdmin() {
    try {
      const profile = await this.getProfile();
      return !!profile?.isAdmin;
    } catch (err) {
      console.error('Error checking admin:', err);
      return false;
    }
  },

  async getName() {
    try {
      const profile = await this.getProfile();
      return profile?.fullName || 'User';
    } catch (err) {
      console.error('Error checking name:', err);
      return "User Error";
    }
  },


  async getProfile() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return null;
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.maybeSingle();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.error('Profile fetch error:', error?.message);
        return null;
      }
      return toCamelCase(data || null);
    } catch (err) {
      console.error('Error in getProfile:', err);
      return null;
    }
  },

}

// Inventory Service
export const inventoryService = {
  async getAll() {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase?.from('inventory_items')?.select('*')?.eq('user_id', user?.id)?.order('added_date', { ascending: false });

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Inventory fetch error:', error?.message);
      return [];
    }
    return toCamelCase(data || []);
  },

  // Budget Service: monthly budgets per user (or global when user_id is null)
  async getBudgetForMonth(month) {
    try {
      const m = month || new Date().toISOString().slice(0, 7);
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = user?.id;

      // try per-user budget first
      if (userId) {
        const { data, error } = await supabase?.from('monthly_budgets')?.select('*')?.eq('user_id', userId)?.eq('month', m)?.maybeSingle();
        if (error) {
          if (isSchemaError(error)) throw error;
          console.error('Budget fetch error (user):', error?.message);
        }
        if (data) return toCamelCase(data);
      }

      // fallback to global budget
      const { data: global, error: globalErr } = await supabase?.from('monthly_budgets')?.select('*')?.is('user_id', null)?.eq('month', m)?.maybeSingle();
      if (globalErr) {
        if (isSchemaError(globalErr)) throw globalErr;
        console.error('Budget fetch error (global):', globalErr?.message);
      }
      return toCamelCase(global || null);
    } catch (err) {
      console.error('Error in getBudgetForMonth:', err);
      return null;
    }
  },

  async setBudgetForMonth({ month, amount, note, userId = null }) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const uid = userId ?? user?.id ?? null;
      const payload = toSnakeCase({ userId: uid, month, amount, note });
      const { data, error } = await supabase?.from('monthly_budgets')?.insert(payload)?.select()?.single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.error('Budget create error:', error?.message);
        return null;
      }
      return toCamelCase(data);
    } catch (err) {
      console.error('Error in setBudgetForMonth:', err);
      return null;
    }
  },

  async updateBudget(id, updates) {
    try {
      const payload = toSnakeCase(updates);
      const { data, error } = await supabase?.from('monthly_budgets')?.update(payload)?.eq('id', id)?.select()?.single();
      if (error) {
        if (isSchemaError(error)) throw error;
        console.error('Budget update error:', error?.message);
        return null;
      }
      return toCamelCase(data);
    } catch (err) {
      console.error('Error in updateBudget:', err);
      return null;
    }
  },

  async create(item) {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('Not authenticated');

    const itemData = toSnakeCase({ ...item, userId: user?.id });
    const { data, error } = await supabase?.from('inventory_items')?.insert(itemData)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Inventory create error:', error?.message);
      return null;
    }
    return toCamelCase(data);
  },

  async update(id, updates) {
    const updateData = toSnakeCase(updates);
    const { data, error } = await supabase?.from('inventory_items')?.update(updateData)?.eq('id', id)?.select()?.single();

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Inventory update error:', error?.message);
      return null;
    }
    return toCamelCase(data);
  },

  async delete(id) {
    const { error } = await supabase?.from('inventory_items')?.delete()?.eq('id', id);

    if (error) {
      if (isSchemaError(error)) throw error;
      console.error('Inventory delete error:', error?.message);
      return false;
    }
    return true;
  }
};

// Lookup service: centralized helpers for enums and lightweight lookups with simple in-memory caching
const _lookupCache = {
  enums: {}, // { [enumName]: { value: [...], ts: number } }
  assignees: { value: [], ts: 0 }
};

export const lookupService = {
  async getEnumValues(enumName, { forceRefresh = false, ttlMs = 43200000 } = {}) {
    try {
      const now = Date.now();
      const cached = _lookupCache.enums?.[enumName];
      if (!forceRefresh && cached && now - cached.ts < ttlMs) {
        return cached.value;
      }

      const res = await supabase.rpc('get_enum_values', { enum_name: enumName });
      if (res?.error) {
        if (isSchemaError(res.error)) throw res.error;
        console.error('RPC returned error for get_enum_values:', res.error);
        const fallback = Constants?.public?.Enums?.[enumName] || [];
        _lookupCache.enums[enumName] = { value: fallback, ts: now };
        return fallback;
      }

      const values = res?.data || Constants?.public?.Enums?.[enumName] || [];
      _lookupCache.enums[enumName] = { value: values, ts: now };
      return values;
    } catch (err) {
      console.error('Error fetching enum values:', err);
      const fallback = Constants?.public?.Enums?.[enumName] || [];
      _lookupCache.enums[enumName] = { value: fallback, ts: Date.now() };
      return fallback;
    }
  },

  async getAssignees({ forceRefresh = false, ttlMs = 60000 } = {}) {
    try {
      const now = Date.now();
      const cached = _lookupCache.assignees;
      if (!forceRefresh && cached && (now - cached.ts) < ttlMs && (cached.value || []).length > 0) {
        return cached.value;
      }

      const { data, error } = await supabase.from('assignees').select('id, name, avatar, avatar_alt').order('name', { ascending: true });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.error('Error fetching assignees:', error?.message);
        return cached?.value || [];
      }

      const unique = [];
      const seen = new Set();
      (data || []).forEach(a => {
        if (a?.name && !seen.has(a.name)) {
          seen.add(a.name);
          unique.push({ id: a.id, name: a.name, avatar: a.avatar, avatarAlt: a.avatar_alt });
        }
      });

      _lookupCache.assignees = { value: unique, ts: Date.now() };
      return unique;
    } catch (err) {
      console.error('Error in getAssignees:', err);
      return _lookupCache.assignees?.value || [];
    }
  },

  // Utility to clear the cache (useful for manual refreshes or tests)
  clearCache() {
    _lookupCache.enums = {};
    _lookupCache.assignees = { value: [], ts: 0 };
  }
};